"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, SlidersHorizontal, Clock, Star } from "lucide-react"

interface FilterOptions {
  contentType: string
  minReadingTime: number
  maxReadingTime: number
  includePopular: boolean
  sortBy: string
  difficulty: string
}

export function ContentFilters({ onFilterChange }: { onFilterChange: (filters: FilterOptions) => void }) {
  const [filters, setFilters] = useState<FilterOptions>({
    contentType: "all",
    minReadingTime: 5,
    maxReadingTime: 30,
    includePopular: true,
    sortBy: "relevance",
    difficulty: "all"
  })

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  return (
    <Card className="w-full">
      <CardContent className="grid gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <h3 className="font-medium">Advanced Filters</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleFilterChange({
            contentType: "all",
            minReadingTime: 5,
            maxReadingTime: 30,
            includePopular: true,
            sortBy: "relevance",
            difficulty: "all"
          })}>
            Reset
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Content Type</Label>
            <Select
              value={filters.contentType}
              onValueChange={(value) => handleFilterChange({ contentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="articles">Articles</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Reading Time (minutes)</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <Slider
                min={0}
                max={60}
                step={5}
                value={[filters.minReadingTime, filters.maxReadingTime]}
                onValueChange={([min, max]) => handleFilterChange({ minReadingTime: min, maxReadingTime: max })}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.minReadingTime} min</span>
              <span>{filters.maxReadingTime} min</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="readingTime">Reading Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Difficulty Level</Label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => handleFilterChange({ difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.includePopular}
              onCheckedChange={(checked) => handleFilterChange({ includePopular: checked })}
            />
            <Label>Include Popular Content</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 