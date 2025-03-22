from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import httpx
import json
from datetime import datetime
import uuid
import asyncio

# Initialize FastAPI app
app = FastAPI(title="RecommendAI API", description="API for content recommendations using Ollama")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API configuration
OLLAMA_API_URL = "http://localhost:11434/api"
DEFAULT_MODEL = "llama3"  # Change to your preferred Ollama model

# Pydantic models for request/response validation
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = DEFAULT_MODEL
    temperature: float = 0.7
    max_tokens: int = 500

class UserPreferences(BaseModel):
    genres: List[str]
    topics: List[str]
    freeform: str

class ContentItem(BaseModel):
    id: str
    title: str
    description: str
    content: str
    imageUrl: Optional[str] = None
    url: str
    type: str
    tags: List[str]
    publishedAt: datetime
    source: str
    relevanceScore: float

# Helper function to call Ollama API
async def call_ollama(prompt: str, model: str = DEFAULT_MODEL, temperature: float = 0.7, max_tokens: int = 500):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_API_URL}/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": False
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Ollama API error")
            
            result = response.json()
            return result.get("response", "")
    except Exception as e:
        print(f"Error calling Ollama: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to call Ollama: {str(e)}")

# Endpoint to generate chat responses
@app.post("/api/chat")
async def generate_chat_response(request: ChatRequest):
    # Format messages for Ollama
    formatted_prompt = ""
    for msg in request.messages:
        role_prefix = "User: " if msg.role == "user" else "Assistant: "
        formatted_prompt += f"{role_prefix}{msg.content}\n"
    
    formatted_prompt += "Assistant: "
    
    # Call Ollama API
    response_text = await call_ollama(
        prompt=formatted_prompt,
        model=request.model,
        temperature=request.temperature,
        max_tokens=request.max_tokens
    )
    
    return {"response": response_text}

# Endpoint to generate recommendations based on user preferences
@app.post("/api/recommendations")
async def generate_recommendations(preferences: UserPreferences):
    # Create a prompt for Ollama to generate content recommendations
    articles_prompt = f"""
    You are a content recommendation system. Based on the following user preferences, generate 6 article recommendations.
    
    User preferences:
    - Genres: {', '.join(preferences.genres)}
    - Topics: {', '.join(preferences.topics)}
    - Additional preferences: {preferences.freeform}
    
    For each article, provide the following information in JSON format:
    {{
        "title": "Article title",
        "description": "Brief description",
        "content": "First paragraph or summary of the article",
        "tags": ["tag1", "tag2", "tag3"],
        "source": "Publication name"
    }}
    
    Return a JSON array with 6 articles. Make sure the content is diverse but relevant to the user's interests.
    Only return the JSON array, no other text.
    """
    
    books_prompt = f"""
    You are a content recommendation system. Based on the following user preferences, generate 6 book recommendations.
    
    User preferences:
    - Genres: {', '.join(preferences.genres)}
    - Topics: {', '.join(preferences.topics)}
    - Additional preferences: {preferences.freeform}
    
    For each book, provide the following information in JSON format:
    {{
        "title": "Book title",
        "description": "Brief description",
        "content": "Summary or excerpt from the book",
        "tags": ["tag1", "tag2", "tag3"],
        "source": "Publisher or author"
    }}
    
    Return a JSON array with 6 books. Make sure the content is diverse but relevant to the user's interests.
    Only return the JSON array, no other text.
    """
    
    videos_prompt = f"""
    You are a content recommendation system. Based on the following user preferences, generate 6 video recommendations.
    
    User preferences:
    - Genres: {', '.join(preferences.genres)}
    - Topics: {', '.join(preferences.topics)}
    - Additional preferences: {preferences.freeform}
    
    For each video, provide the following information in JSON format:
    {{
        "title": "Video title",
        "description": "Brief description",
        "content": "Summary of what the video is about",
        "tags": ["tag1", "tag2", "tag3"],
        "source": "Channel or creator name"
    }}
    
    Return a JSON array with 6 videos. Make sure the content is diverse but relevant to the user's interests.
    Only return the JSON array, no other text.
    """
    
    try:
        # Generate content recommendations in parallel
        articles_task = call_ollama(prompt=articles_prompt, max_tokens=2000)
        books_task = call_ollama(prompt=books_prompt, max_tokens=2000)
        videos_task = call_ollama(prompt=videos_prompt, max_tokens=2000)
        
        articles_response, books_response, videos_response = await asyncio.gather(
            articles_task, books_task, videos_task
        )
        
        # Process the responses
        try:
            # Clean up the responses to ensure they're valid JSON
            articles_json = articles_response.strip()
            if not articles_json.startswith('['):
                articles_json = articles_json[articles_json.find('['):]
            if not articles_json.endswith(']'):
                articles_json = articles_json[:articles_json.rfind(']')+1]
                
            books_json = books_response.strip()
            if not books_json.startswith('['):
                books_json = books_json[books_json.find('['):]
            if not books_json.endswith(']'):
                books_json = books_json[:books_json.rfind(']')+1]
                
            videos_json = videos_response.strip()
            if not videos_json.startswith('['):
                videos_json = videos_json[videos_json.find('['):]
            if not videos_json.endswith(']'):
                videos_json = videos_json[:videos_json.rfind(']')+1]
            
            # Parse the JSON responses
            articles_data = json.loads(articles_json)
            books_data = json.loads(books_json)
            videos_data = json.loads(videos_json)
            
            # Process articles
            articles = []
            for i, item in enumerate(articles_data):
                # Generate a unique ID
                item_id = f"a{i+1}"
                
                # Create a ContentItem
                article = {
                    "id": item_id,
                    "title": item["title"],
                    "description": item["description"],
                    "content": item["content"],
                    "imageUrl": f"/placeholder.svg?height=200&width=400&text={item['title'][:20]}",
                    "url": "#",
                    "type": "article",
                    "tags": item["tags"],
                    "publishedAt": datetime.now().isoformat(),
                    "source": item["source"],
                    "relevanceScore": 0.9 - (i * 0.02)  # Decreasing relevance score
                }
                articles.append(article)
            
            # Process books
            books = []
            for i, item in enumerate(books_data):
                # Generate a unique ID
                item_id = f"b{i+1}"
                
                # Create a ContentItem
                book = {
                    "id": item_id,
                    "title": item["title"],
                    "description": item["description"],
                    "content": item["content"],
                    "imageUrl": f"/placeholder.svg?height=200&width=400&text={item['title'][:20]}",
                    "url": "#",
                    "type": "book",
                    "tags": item["tags"],
                    "publishedAt": datetime.now().isoformat(),
                    "source": item["source"],
                    "relevanceScore": 0.9 - (i * 0.02)  # Decreasing relevance score
                }
                books.append(book)
            
            # Process videos
            videos = []
            for i, item in enumerate(videos_data):
                # Generate a unique ID
                item_id = f"v{i+1}"
                
                # Create a ContentItem
                video = {
                    "id": item_id,
                    "title": item["title"],
                    "description": item["description"],
                    "content": item["content"],
                    "imageUrl": f"/placeholder.svg?height=200&width=400&text={item['title'][:20]}",
                    "url": "#",
                    "type": "video",
                    "tags": item["tags"],
                    "publishedAt": datetime.now().isoformat(),
                    "source": item["source"],
                    "relevanceScore": 0.9 - (i * 0.02)  # Decreasing relevance score
                }
                videos.append(video)
            
            return {
                "articles": articles,
                "books": books,
                "videos": videos
            }
            
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {str(e)}")
            print(f"Articles response: {articles_response}")
            print(f"Books response: {books_response}")
            print(f"Videos response: {videos_response}")
            raise HTTPException(status_code=500, detail=f"Failed to parse recommendations: {str(e)}")
            
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

# Endpoint to record user feedback
@app.post("/api/feedback")
async def record_feedback(feedback: Dict[str, Any] = Body(...)):
    content_id = feedback.get("contentId")
    is_positive = feedback.get("isPositive")
    
    if not content_id:
        raise HTTPException(status_code=400, detail="Content ID is required")
    
    # In a real app, store this feedback in a database
    print(f"Received feedback for content {content_id}: {'positive' if is_positive else 'negative'}")
    
    # Use Ollama to analyze feedback and update user profile
    feedback_prompt = f"""
    A user has given {'positive' if is_positive else 'negative'} feedback on content with ID {content_id}.
    Based on this feedback, how should we adjust the user's profile and future recommendations?
    Provide a brief analysis.
    """
    
    try:
        analysis = await call_ollama(prompt=feedback_prompt, max_tokens=200)
        print(f"Feedback analysis: {analysis}")
        return {"success": True, "message": "Feedback recorded successfully", "analysis": analysis}
    except Exception as e:
        print(f"Error analyzing feedback: {str(e)}")
        return {"success": True, "message": "Feedback recorded successfully"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "ollama_connected": await check_ollama_connection()}

async def check_ollama_connection():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_API_URL}/tags", timeout=5.0)
            return response.status_code == 200
    except:
        return False

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

