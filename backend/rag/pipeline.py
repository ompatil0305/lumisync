import logging
from services.gemini_service import GeminiService
from services.vector_service import VectorService
from prompts.manager import get_system_prompt

logger = logging.getLogger(__name__)

class RAGPipeline:
    def __init__(self):
        self.ai_service = GeminiService()
        self.vector_service = VectorService()

    async def chat(self, messages: list[dict], university_id: str = "ttu"):
        """Process a chat request through the RAG pipeline."""
        try:
            # 1. Get the latest user question
            user_question = messages[-1]["content"] if messages else ""
            
            # 2. Generate embedding for the question
            question_embedding = await self.ai_service.get_embedding(user_question)
            
            # 3. Retrieve relevant documents from pgvector
            relevant_docs = self.vector_service.search_similar(question_embedding, limit=5)
            
            # 4. Format context
            context_text = "Here is some information from the university knowledge base:\n\n"
            citations = []
            for doc in relevant_docs:
                meta = doc.get("metadata", {})
                source = meta.get("source", "Unknown Source")
                title = meta.get("title", "Document")
                url = meta.get("url", "")
                
                context_text += f"[{title}]({url}): {doc['content']}\n\n"
                citations.append({
                    "id": doc.get("id"),
                    "title": title,
                    "url": url,
                    "source": source,
                    "content": doc['content']
                })
            
            # 5. Build prompt
            system_prompt = get_system_prompt(university_id, context_text)
            
            # 6. Stream response from AI
            async def stream_with_citations():
                # We yield a JSON string for each chunk so the frontend can parse citations if needed,
                # or just stream the text and send citations at the start/end.
                # For simplicity, we just yield raw text to stream, 
                # but we could wrap it if we want custom SSE.
                async for chunk in self.ai_service.chat_stream(messages, system_prompt):
                    yield chunk

            return stream_with_citations(), citations

        except Exception as e:
            logger.error(f"RAG Pipeline Error: {e}")
            raise e
