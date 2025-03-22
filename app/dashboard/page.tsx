"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Film, Newspaper, MessageSquare, Share2, AlertTriangle } from "lucide-react"
import { generateRecommendations } from "@/lib/recommendations"
import type { ContentItem } from "@/lib/types"
import ContentCard from "@/components/content-card"
import ChatInterface from "@/components/chat-interface"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"
import { ContentFilters } from "@/components/content-filters"

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<{
    articles: ContentItem[]
    books: ContentItem[]
    videos: ContentItem[]
  }>({
    articles: [],
    books: [],
    videos: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeTab, setActiveTab] = useState("articles")

  const handleFilterChange = async (filters: any) => {
    setLoading(true)
    try {
      // In a real app, this would apply the filters to the API call
      const recs = await generateRecommendations(filters)
      setRecommendations(recs)
    } catch (error) {
      console.error("Error applying filters:", error)
      setError(error instanceof Error ? error.message : "Failed to apply filters")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (item: ContentItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${item.title}\n${item.description}\n${item.url}`)
      alert("Link copied to clipboard!")
    }
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError(null)
      try {
        const recs = await generateRecommendations()
        setRecommendations(recs)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setError(error instanceof Error ? error.message : "Failed to load recommendations")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IllusiveSystems Dashboard</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={() => setShowProfile(!showProfile)}>
            {showProfile ? "Hide Profile" : "Show Profile"}
          </Button>
          <Button onClick={() => setShowChat(!showChat)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat Assistant
          </Button>
        </div>
      </div>

      {showProfile && (
        <div className="mb-6">
          <UserProfile />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ContentFilters onFilterChange={handleFilterChange} />
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="articles">
                <Newspaper className="w-4 h-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="books">
                <BookOpen className="w-4 h-4 mr-2" />
                Books
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Film className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>

            {error ? (
              <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <TabsContent value="articles" className="mt-6">
                  <div className="grid gap-6">
                    {loading ? (
                      <Card>
                        <CardContent className="p-6">Loading articles...</CardContent>
                      </Card>
                    ) : (
                      recommendations.articles.map((article) => (
                        <ContentCard
                          key={article.id}
                          item={article}
                          onShare={() => handleShare(article)}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="books" className="mt-6">
                  <div className="grid gap-6">
                    {loading ? (
                      <Card>
                        <CardContent className="p-6">Loading books...</CardContent>
                      </Card>
                    ) : (
                      recommendations.books.map((book) => (
                        <ContentCard
                          key={book.id}
                          item={book}
                          onShare={() => handleShare(book)}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="mt-6">
                  <div className="grid gap-6">
                    {loading ? (
                      <Card>
                        <CardContent className="p-6">Loading videos...</CardContent>
                      </Card>
                    ) : (
                      recommendations.videos.map((video) => (
                        <ContentCard
                          key={video.id}
                          item={video}
                          onShare={() => handleShare(video)}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-6 right-6 w-96">
          <ChatInterface onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  )
}

