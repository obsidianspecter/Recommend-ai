import type { ContentItem } from "./types"

// Function to call our FastAPI backend for recommendations
export async function generateRecommendations() {
  try {
    // Get user preferences from localStorage or use default values
    const storedPreferences = localStorage.getItem("userPreferences")
    const preferences = storedPreferences
      ? JSON.parse(storedPreferences)
      : {
          genres: ["Fiction", "Science Fiction", "Technology"],
          topics: ["Artificial Intelligence", "Space Exploration"],
          freeform: "I enjoy content about AI, machine learning, and technology innovations.",
        }

    // Call the FastAPI backend
    const response = await fetch("http://localhost:8000/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Convert string dates to Date objects
    const processItems = (items: any[]): ContentItem[] => {
      return items.map((item) => ({
        ...item,
        publishedAt: new Date(item.publishedAt),
      }))
    }

    return {
      articles: processItems(data.articles),
      books: processItems(data.books),
      videos: processItems(data.videos),
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    // Instead of falling back to mock data, show an error
    throw new Error("Failed to get recommendations from AI. Please try again later.")
  }
}

// Keep the mock functions as fallback
function generateMockArticles(): ContentItem[] {
  return [
    {
      id: "a1",
      title: "The Future of AI in Content Recommendation",
      description: "How artificial intelligence is revolutionizing the way we discover content",
      content:
        "Artificial intelligence has made significant strides in recent years, particularly in the realm of content recommendation. By analyzing user behavior and preferences, AI algorithms can now predict with remarkable accuracy what articles, videos, or books a person might enjoy...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["AI", "Technology", "Content"],
      publishedAt: new Date("2023-11-15"),
      source: "Tech Insights",
      relevanceScore: 0.95,
    },
    {
      id: "a2",
      title: "Understanding Deep Learning Models for Natural Language Processing",
      description: "A comprehensive guide to modern NLP techniques",
      content:
        "Natural Language Processing (NLP) has evolved dramatically with the advent of deep learning. This article explores how transformer models like BERT and GPT have changed the landscape of language understanding and generation...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["Deep Learning", "NLP", "AI"],
      publishedAt: new Date("2023-10-22"),
      source: "AI Research Weekly",
      relevanceScore: 0.89,
    },
    {
      id: "a3",
      title: "The Psychology Behind Content Consumption",
      description: "Why we read what we read and watch what we watch",
      content:
        "Human psychology plays a crucial role in determining our content preferences. This article delves into the cognitive biases and psychological factors that influence our choices when it comes to articles, books, and videos...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["Psychology", "Content", "Behavior"],
      publishedAt: new Date("2023-09-30"),
      source: "Mind Matters",
      relevanceScore: 0.82,
    },
    {
      id: "a4",
      title: "Ethical Considerations in AI-Driven Recommendation Systems",
      description: "Navigating the moral implications of algorithmic content curation",
      content:
        "As AI recommendation systems become more prevalent, ethical questions arise about filter bubbles, algorithmic bias, and user autonomy. This article examines the ethical considerations that developers and companies must address...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["Ethics", "AI", "Technology"],
      publishedAt: new Date("2023-11-05"),
      source: "Digital Ethics Journal",
      relevanceScore: 0.78,
    },
    {
      id: "a5",
      title: "The Rise of Personalized Learning Platforms",
      description: "How AI is transforming education through customized content delivery",
      content:
        "Educational platforms are increasingly leveraging AI to deliver personalized learning experiences. This article explores how recommendation algorithms are being applied to educational content to enhance student engagement and outcomes...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["Education", "AI", "Learning"],
      publishedAt: new Date("2023-10-10"),
      source: "EdTech Today",
      relevanceScore: 0.85,
    },
    {
      id: "a6",
      title: "Content Discovery in the Age of Information Overload",
      description: "Strategies for finding relevant content in a sea of information",
      content:
        "With the exponential growth of online content, finding relevant information has become increasingly challenging. This article discusses various approaches to content discovery, from AI recommendations to human curation...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "article",
      tags: ["Information", "Content", "Digital"],
      publishedAt: new Date("2023-11-20"),
      source: "Digital Trends",
      relevanceScore: 0.91,
    },
  ]
}

function generateMockBooks(): ContentItem[] {
  return [
    {
      id: "b1",
      title: "Artificial Intelligence: A Modern Approach",
      description: "The definitive textbook on AI by Stuart Russell and Peter Norvig",
      content:
        "This comprehensive guide to artificial intelligence covers everything from search algorithms and knowledge representation to machine learning and deep neural networks...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["AI", "Textbook", "Computer Science"],
      publishedAt: new Date("2020-04-28"),
      source: "Pearson",
      relevanceScore: 0.94,
    },
    {
      id: "b2",
      title: "Deep Learning",
      description: "An essential guide to the fundamentals of deep learning",
      content:
        "Written by Ian Goodfellow, Yoshua Bengio, and Aaron Courville, this book provides a comprehensive introduction to deep learning, covering both theoretical foundations and practical applications...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["Deep Learning", "AI", "Neural Networks"],
      publishedAt: new Date("2016-11-18"),
      source: "MIT Press",
      relevanceScore: 0.88,
    },
    {
      id: "b3",
      title: "Hands-On Machine Learning with Scikit-Learn and TensorFlow",
      description: "Practical implementation of machine learning algorithms",
      content:
        "This practical guide by Aurélien Géron provides hands-on examples and real-world applications of machine learning using popular libraries like Scikit-Learn and TensorFlow...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["Machine Learning", "Python", "Programming"],
      publishedAt: new Date("2019-10-15"),
      source: "O'Reilly Media",
      relevanceScore: 0.92,
    },
    {
      id: "b4",
      title: "The Hundred-Page Machine Learning Book",
      description: "A concise introduction to machine learning principles",
      content:
        "Andriy Burkov's book provides a concise yet comprehensive overview of machine learning concepts, making it accessible to beginners while still offering valuable insights for experienced practitioners...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["Machine Learning", "AI", "Introduction"],
      publishedAt: new Date("2019-01-13"),
      source: "Andriy Burkov",
      relevanceScore: 0.85,
    },
    {
      id: "b5",
      title: "Pattern Recognition and Machine Learning",
      description: "A comprehensive introduction to pattern recognition",
      content:
        "Christopher Bishop's textbook is a thorough introduction to pattern recognition and machine learning, covering topics such as Bayesian methods, neural networks, and graphical models...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["Pattern Recognition", "Machine Learning", "Statistics"],
      publishedAt: new Date("2006-08-17"),
      source: "Springer",
      relevanceScore: 0.79,
    },
    {
      id: "b6",
      title: "Natural Language Processing with Python",
      description: "Analyzing text with the Natural Language Toolkit",
      content:
        "This practical guide introduces readers to natural language processing through the NLTK library, covering topics such as tokenization, part-of-speech tagging, and sentiment analysis...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "book",
      tags: ["NLP", "Python", "Programming"],
      publishedAt: new Date("2019-07-16"),
      source: "O'Reilly Media",
      relevanceScore: 0.87,
    },
  ]
}

function generateMockVideos(): ContentItem[] {
  return [
    {
      id: "v1",
      title: "Introduction to Machine Learning",
      description: "A beginner-friendly overview of machine learning concepts",
      content:
        "This video provides a comprehensive introduction to machine learning, covering supervised and unsupervised learning, common algorithms, and practical applications...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["Machine Learning", "AI", "Tutorial"],
      publishedAt: new Date("2023-08-15"),
      source: "Tech Academy",
      relevanceScore: 0.96,
    },
    {
      id: "v2",
      title: "Building Recommendation Systems with TensorFlow",
      description: "Step-by-step guide to creating a recommendation engine",
      content:
        "This tutorial walks through the process of building a content recommendation system using TensorFlow, from data preprocessing to model deployment...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["TensorFlow", "Recommendation Systems", "Tutorial"],
      publishedAt: new Date("2023-09-22"),
      source: "AI Tutorials",
      relevanceScore: 0.93,
    },
    {
      id: "v3",
      title: "The Ethics of AI: Bias in Recommendation Algorithms",
      description: "Exploring the ethical implications of AI-driven content curation",
      content:
        "This panel discussion features experts debating the ethical considerations surrounding recommendation algorithms, including issues of bias, transparency, and user autonomy...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["Ethics", "AI", "Bias"],
      publishedAt: new Date("2023-10-05"),
      source: "Tech Ethics Forum",
      relevanceScore: 0.81,
    },
    {
      id: "v4",
      title: "Deep Dive into Natural Language Processing",
      description: "Advanced techniques for understanding and generating human language",
      content:
        "This technical lecture explores cutting-edge approaches to natural language processing, including transformer models, attention mechanisms, and recent advances in language generation...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["NLP", "Deep Learning", "AI"],
      publishedAt: new Date("2023-07-18"),
      source: "AI Research Conference",
      relevanceScore: 0.89,
    },
    {
      id: "v5",
      title: "Content Personalization at Scale",
      description: "How major platforms implement recommendation systems",
      content:
        "This case study examines how leading tech companies implement content personalization at scale, discussing architecture, algorithms, and lessons learned...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["Personalization", "Recommendation Systems", "Case Study"],
      publishedAt: new Date("2023-11-10"),
      source: "Tech Insights",
      relevanceScore: 0.9,
    },
    {
      id: "v6",
      title: "The Future of Content Discovery",
      description: "Emerging trends in how we find and consume information",
      content:
        "This forward-looking presentation explores how content discovery might evolve in the coming years, from multimodal recommendations to AR/VR content experiences...",
      imageUrl: "/placeholder.svg?height=200&width=400",
      url: "#",
      type: "video",
      tags: ["Future", "Content", "Technology"],
      publishedAt: new Date("2023-10-30"),
      source: "Digital Summit",
      relevanceScore: 0.86,
    },
  ]
}

