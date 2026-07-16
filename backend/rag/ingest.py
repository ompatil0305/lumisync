import json
import asyncio
import logging
from uuid import uuid4
from services.gemini_service import GeminiService
from services.vector_service import VectorService, Document
from config import settings
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample data for initial test. In production, this would read from a JSON file or API.
CAMPUS_DATA = [
    {
        "title": "Holden Hall",
        "url": "https://map.ttu.edu",
        "source": "Campus Map",
        "content": "Historic academic building housing the Departments of Computer Science, Mathematics & Statistics, and Physics. Built in 1930, Holden Hall is one of the most recognizable buildings on campus with its Spanish Renaissance architecture. Located at 1011 Boston Ave."
    },
    {
        "title": "Student Union Building",
        "url": "https://map.ttu.edu",
        "source": "Campus Map",
        "content": "The central hub of student life on campus. Features the Barnes & Noble bookstore, multiple dining options including Chick-fil-A and Sam's Place, student organization offices, and the Allen Theatre. Located at 1502 15th St."
    },
    {
        "title": "Commuter West Parking",
        "url": "https://www.depts.ttu.edu/parking/",
        "source": "Parking",
        "content": "Large commuter parking lot located near the United Supermarkets Arena. Requires a Commuter West permit. Shuttle bus service runs every 5-10 minutes to the center of campus. Located at 1701 Indiana Ave."
    },
    {
        "title": "The Market at Stangel/Murdough",
        "url": "https://www.depts.ttu.edu/hospitality/",
        "source": "Dining",
        "content": "One of the largest dining facilities on campus offering a variety of stations including a salad bar, grill, pizza, and international cuisine. Features late-night dining options and a mini-market. Accepts Dining Bucks and credit cards. Located at 3211 Main St."
    },
    {
        "title": "Fall Semester Information",
        "url": "https://www.ttu.edu",
        "source": "Academic Calendar",
        "content": "The Fall semester typically begins in late August. Major holidays include Labor Day and Thanksgiving Break. Final exams are held in mid-December."
    }
]

async def ingest_data():
    logger.info("Initializing vector database...")
    vector_service = VectorService()
    vector_service.init_db()

    logger.info("Initializing AI service...")
    ai_service = GeminiService()

    documents_to_insert = []

    for item in CAMPUS_DATA:
        logger.info(f"Generating embedding for: {item['title']}")
        try:
            embedding = await ai_service.get_embedding(item['content'])
            doc_id = str(uuid4())
            
            doc = {
                "id": doc_id,
                "content": item['content'],
                "embedding": embedding,
                "metadata": {
                    "title": item['title'],
                    "url": item['url'],
                    "source": item['source'],
                    "university_id": "ttu"
                }
            }
            documents_to_insert.append(doc)
        except Exception as e:
            logger.error(f"Failed to embed {item['title']}: {e}")

    if documents_to_insert:
        logger.info(f"Inserting {len(documents_to_insert)} documents into pgvector...")
        vector_service.insert_documents(documents_to_insert)
        logger.info("Ingestion complete!")
    else:
        logger.warning("No documents to insert.")

if __name__ == "__main__":
    asyncio.run(ingest_data())
