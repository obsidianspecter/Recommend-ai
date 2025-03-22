"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, BookMarked, History } from "lucide-react"

interface UserStats {
  articlesRead: number
  booksCompleted: number
  videosWatched: number
  favoriteTopics: string[]
}

export function UserProfile() {
  const [userStats, setUserStats] = useState<UserStats>({
    articlesRead: 42,
    booksCompleted: 12,
    videosWatched: 28,
    favoriteTopics: ["AI", "Technology", "Science", "History"]
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>User Profile</CardTitle>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <BookMarked className="w-4 h-4 mr-2" />
              Bookmarks
            </Button>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label>Reading Stats</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <span className="text-2xl font-bold">{userStats.articlesRead}</span>
                <span className="text-sm text-muted-foreground">Articles</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <span className="text-2xl font-bold">{userStats.booksCompleted}</span>
                <span className="text-sm text-muted-foreground">Books</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg">
                <span className="text-2xl font-bold">{userStats.videosWatched}</span>
                <span className="text-sm text-muted-foreground">Videos</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Favorite Topics</Label>
            <div className="flex flex-wrap gap-2">
              {userStats.favoriteTopics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 