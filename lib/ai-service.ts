export async function generateChatResponse(userInput: string, chatHistory: any[]): Promise<string> {
  try {
    // Convert our internal message format to the format expected by the FastAPI backend
    const messages = chatHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add the new user message
    messages.push({
      role: "user",
      content: userInput,
    })

    // Call the FastAPI backend
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model: "llama3", // Default model, can be changed
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error generating AI response:", error)

    // Fallback to mock responses if the API call fails
    if (userInput.toLowerCase().includes("book") || userInput.toLowerCase().includes("read")) {
      return "Based on your interests, I recommend 'Artificial Intelligence: A Modern Approach' by Stuart Russell and Peter Norvig. It's a comprehensive guide to AI that covers everything from basic principles to advanced techniques. Would you like more book recommendations in a specific area of AI or technology?"
    } else if (userInput.toLowerCase().includes("video") || userInput.toLowerCase().includes("watch")) {
      return "I found a great video series called 'Introduction to Machine Learning' that matches your interests in AI and technology. It provides a beginner-friendly overview of key concepts and applications. Would you like me to suggest more videos on specific topics?"
    } else if (userInput.toLowerCase().includes("article") || userInput.toLowerCase().includes("blog")) {
      return "I've found an interesting article titled 'The Future of AI in Content Recommendation' that discusses how AI is revolutionizing content discovery. It aligns with your interest in technology and artificial intelligence. Would you like me to find more articles on this topic?"
    } else {
      return "Based on your profile and past interactions, I think you might enjoy content about artificial intelligence and machine learning. Would you like recommendations for articles, books, or videos on these topics? Or is there another subject you're interested in exploring?"
    }
  }
}

