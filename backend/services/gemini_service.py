import logging
from google import genai
from google.genai import types
from config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        import os
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = genai.Client()

    async def get_embedding(self, text: str) -> list[float]:
        """Generate an embedding for a piece of text using Google Gemini."""
        try:
            # We can't use async client for embeddings easily in genai 0.4.0 unless we use async API, 
            # but the sync client works fine. We will use the sync API via self.client.models.embed_content
            # To be safe, we'll wrap it if needed or just call it directly. The prompt called this async.
            # Using the sync call is fine here if we don't have high concurrency yet.
            response = self.client.models.embed_content(
                model=settings.EMBEDDING_MODEL,
                contents=text,
            )
            return response.embeddings[0].values
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise e

    async def chat_stream(self, messages: list[dict], system_prompt: str = None):
        """Generate chat response from Gemini (collected then yielded for streaming compatibility)."""
        import asyncio
        contents = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])])
            )

        config = types.GenerateContentConfig()
        if system_prompt:
            config.system_instruction = system_prompt

        try:
            loop = asyncio.get_event_loop()

            def _call_gemini():
                response = self.client.models.generate_content(
                    model=settings.CHAT_MODEL,
                    contents=contents,
                    config=config,
                )
                return response.text or ""

            full_text = await loop.run_in_executor(None, _call_gemini)
            # Yield in chunks to simulate streaming
            chunk_size = 30
            for i in range(0, len(full_text), chunk_size):
                yield full_text[i:i+chunk_size]
                await asyncio.sleep(0.01)
        except Exception as e:
            logger.error(f"Error in chat stream: {e}")
            raise e
