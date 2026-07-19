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
        try:
            with self.engine.connect() as conn:
                conn.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))
                conn.commit()
            Base.metadata.create_all(bind=self.engine)
            logger.info("Database and vector extension initialized.")
        except Exception as e:
            logger.error(f"Error initializing DB: {e}")

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
