import logging
from sqlalchemy import create_engine, Column, String, Integer, select, text, Index
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'

    id = Column(String, primary_key=True)
    content = Column(String, nullable=False)
    embedding = Column(Vector(768))  # Gemini text-embedding-004 dimension
    metadata_ = Column('metadata', JSONB)

    # Add an HNSW index for fast vector search
    __table_args__ = (
        Index('hnsw_index', 'embedding', postgresql_using='hnsw', postgresql_with={'m': 16, 'ef_construction': 64}, postgresql_ops={'embedding': 'vector_cosine_ops'}),
    )

class VectorService:
    def __init__(self):
        # Convert the async-friendly URL to sync for basic setup if needed, 
        # or use standard psycopg2
        url = settings.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        self.engine = create_engine(url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def init_db(self):
        """Initialize pgvector extension and create tables."""
        import os
        try:
            # Locate schema.sql
            current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            migration_path = os.path.join(current_dir, "migrations", "schema.sql")
            
            if os.path.exists(migration_path):
                logger.info(f"Loading database schema from: {migration_path}")
                with open(migration_path, "r", encoding="utf-8") as f:
                    sql = f.read()
                
                with self.engine.connect() as conn:
                    # Run schema SQL statement by statement
                    statements = [s.strip() for s in sql.split(";") if s.strip()]
                    for statement in statements:
                        conn.execute(text(statement))
                    conn.commit()
                logger.info("Database and tables initialized from schema.sql successfully.")
            else:
                logger.warning(f"Schema migration file not found at: {migration_path}")
                # Fallback to metadata build
                Base.metadata.create_all(bind=self.engine)
        except Exception as e:
            logger.error(f"Error initializing DB: {e}")
            raise e

    def insert_documents(self, documents: list[dict]):
        """Insert embedded documents into the database."""
        db = self.SessionLocal()
        try:
            for doc in documents:
                db_doc = Document(
                    id=doc['id'],
                    content=doc['content'],
                    embedding=doc['embedding'],
                    metadata_=doc['metadata']
                )
                db.merge(db_doc)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error inserting documents: {e}")
            raise e
        finally:
            db.close()

    def search_similar(self, query_embedding: list[float], limit: int = 5) -> list[dict]:
        """Search for the most similar documents using cosine similarity."""
        db = self.SessionLocal()
        try:
            # <=> is the cosine distance operator in pgvector
            stmt = select(Document).order_by(Document.embedding.cosine_distance(query_embedding)).limit(limit)
            results = db.execute(stmt).scalars().all()
            return [
                {
                    "id": row.id,
                    "content": row.content,
                    "metadata": row.metadata_
                }
                for row in results
            ]
        finally:
            db.close()

    def search_knowledge(self, query_embedding: list[float], limit: int = 5) -> list[dict]:
        """Search ttu_knowledge_chunks using cosine similarity and returning similarity scores."""
        db = self.SessionLocal()
        try:
            emb_str = "[" + ",".join(map(str, query_embedding)) + "]"
            query = text("""
                SELECT id, content, metadata, (1 - (embedding <=> :embedding::vector)) as similarity
                FROM ttu_knowledge_chunks
                ORDER BY embedding <=> :embedding::vector
                LIMIT :limit
            """)
            results = db.execute(query, {"embedding": emb_str, "limit": limit})
            return [
                {
                    "id": str(row[0]),
                    "content": row[1],
                    "metadata": row[2] or {},
                    "similarity": float(row[3])
                }
                for row in results
            ]
        except Exception as e:
            logger.error(f"Error in search_knowledge: {e}")
            return []
        finally:
            db.close()

    def insert_knowledge_chunks(self, chunks: list[dict]):
        """Insert embedded knowledge chunks into ttu_knowledge_chunks table."""
        import json
        db = self.SessionLocal()
        try:
            for chunk in chunks:
                insert_query = text("""
                    INSERT INTO ttu_knowledge_chunks (id, content, embedding, metadata)
                    VALUES (:id, :content, :embedding::vector, :metadata)
                    ON CONFLICT (id) DO UPDATE SET
                        content = EXCLUDED.content,
                        embedding = EXCLUDED.embedding,
                        metadata = EXCLUDED.metadata
                """)
                db.execute(insert_query, {
                    "id": chunk["id"],
                    "content": chunk["content"],
                    "embedding": "[" + ",".join(map(str, chunk["embedding"])) + "]",
                    "metadata": json.dumps(chunk["metadata"])
                })
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error inserting knowledge chunks: {e}")
            raise e
        finally:
            db.close()


