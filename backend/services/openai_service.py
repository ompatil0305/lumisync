from openai import AsyncOpenAI
import logging
from config import settings

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def get_embedding(self, text: str) -> list[float]:
        """Generate an embedding for a piece of text."""
        try:
            response = await self.client.embeddings.create(
                input=text,
                model=settings.EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise e

    async def chat_stream(self, messages: list[dict], system_prompt: str = None):
        """Stream chat completions from OpenAI."""
        if system_prompt:
            messages = [{"role": "system", "content": system_prompt}] + messages
            
        try:
            stream = await self.client.chat.completions.create(
                model=settings.CHAT_MODEL,
                messages=messages,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        yield delta
        except Exception as e:
            logger.error(f"Error in chat stream: {e}")
            raise e
