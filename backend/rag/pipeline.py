import logging
import asyncio
from services.gemini_service import GeminiService
from services.vector_service import VectorService
from prompts.manager import get_system_prompt

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self):
        self.ai_service = GeminiService()
        self.vector_service = VectorService()

    async def chat(self, messages: list[dict], university_id: str = "ttu"):
        """Process a chat request through the RAG pipeline with strict threshold checking."""
        try:
            # 1. Get the latest user question
            user_question = messages[-1]["content"] if messages else ""
            
            # 2. Generate embedding for the question
            question_embedding = await self.ai_service.get_embedding(user_question)
            
            # 3. Retrieve relevant documents from pgvector in ttu_knowledge_chunks
            relevant_docs = self.vector_service.search_knowledge(question_embedding, limit=5)
            
            # 4. Check similarity threshold
            best_similarity = relevant_docs[0]["similarity"] if relevant_docs else 0.0
            logger.info(f"RAG query: '{user_question}' -> Best similarity: {best_similarity}")
            
            # Hard refusal if similarity is below threshold (0.65)
            # We want to allow basic greetings like "hi", "hello" if they map to greetings, 
            # but per user instructions: "If the most relevant chunk has a similarity score below a set threshold, bypass the Gemini model API call entirely."
            # To be absolutely safe and strict, check the similarity threshold.
            if best_similarity < 0.65:
                refusal_msg = "I can only help with questions about Texas Tech University, like campus map, dining, parking, faculty, or student organizations. That's outside what I know about."
                
                async def stream_refusal():
                    # Stream the refusal message in chunks of characters to look natural
                    chunk_size = 12
                    for i in range(0, len(refusal_msg), chunk_size):
                        yield refusal_msg[i:i+chunk_size]
                        await asyncio.sleep(0.02)
                        
                return stream_refusal(), []
                
            # 5. Format context
            context_text = "Here is some official information from Texas Tech University:\n\n"
            citations = []
            for doc in relevant_docs:
                meta = doc.get("metadata", {})
                source = meta.get("source", "Texas Tech University")
                title = meta.get("title", "Official Directory/Info")
                url = meta.get("url", "https://www.ttu.edu")
                
                context_text += f"[{title}]({url}): {doc['content']}\n\n"
                citations.append({
                    "id": doc.get("id"),
                    "title": title,
                    "url": url,
                    "source": source,
                    "content": doc['content']
                })
            
            # 6. Build prompt
            system_prompt = get_system_prompt(university_id, context_text)
            
            # 7. Stream response from AI using Gemini
            async def stream_with_citations():
                async for chunk in self.ai_service.chat_stream(messages, system_prompt):
                    yield chunk
 
            return stream_with_citations(), citations
 
        except Exception as e:
            logger.error(f"RAG Pipeline Error: {e}")
            raise e
