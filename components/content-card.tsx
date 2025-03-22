"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, ThumbsUp, ThumbsDown, BookmarkPlus, Clock } from "lucide-react"
import type { ContentItem } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ContentCardProps {
  item: ContentItem
  onShare?: (item: ContentItem) => void
}

export default function ContentCard({ item, onShare }: ContentCardProps) {
  const formattedDate = formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })

  return (
    <Card className="overflow-hidden">
      {item.imageUrl && (
        <div className="relative aspect-video">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-2">{item.title}</CardTitle>
            <CardDescription className="mt-2">
              {item.source} • {formattedDate}
            </CardDescription>
          </div>
          <Badge variant="secondary">{item.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>10 min read</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onShare?.(item)}>
            <Share2 className="w-4 h-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="ghost" size="icon">
            <BookmarkPlus className="w-4 h-4" />
            <span className="sr-only">Save for later</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

