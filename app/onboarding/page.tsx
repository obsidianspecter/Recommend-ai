"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    genres: [],
    topics: [],
    freeform: "",
  })

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Biography",
    "History",
    "Science",
    "Technology",
    "Business",
    "Self-Help",
    "Travel",
  ]

  const topics = [
    "Artificial Intelligence",
    "Climate Change",
    "Space Exploration",
    "Health & Wellness",
    "Personal Finance",
    "Productivity",
    "Politics",
    "Art & Design",
    "Music",
    "Film & TV",
    "Sports",
    "Cooking",
  ]

  const handleGenreChange = (genre: string) => {
    setPreferences((prev) => {
      const newGenres = prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre]
      return { ...prev, genres: newGenres }
    })
  }

  const handleTopicChange = (topic: string) => {
    setPreferences((prev) => {
      const newTopics = prev.topics.includes(topic) ? prev.topics.filter((t) => t !== topic) : [...prev.topics, topic]
      return { ...prev, topics: newTopics }
    })
  }

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences((prev) => ({ ...prev, freeform: e.target.value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save preferences to localStorage
      localStorage.setItem("userPreferences", JSON.stringify(preferences))

      // In a real app, you would save the preferences to a database
      console.log("Preferences:", preferences)
      router.push("/dashboard")
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Tell us about your preferences</CardTitle>
          <CardDescription>
            Step {step} of 3:{" "}
            {step === 1
              ? "Select genres you enjoy"
              : step === 2
                ? "Choose topics of interest"
                : "Tell us more about yourself"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={preferences.genres.includes(genre)}
                    onCheckedChange={() => handleGenreChange(genre)}
                  />
                  <Label htmlFor={genre}>{genre}</Label>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic}
                    checked={preferences.topics.includes(topic)}
                    onCheckedChange={() => handleTopicChange(topic)}
                  />
                  <Label htmlFor={topic}>{topic}</Label>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="freeform">Tell us more about what you like to read, watch, or learn about</Label>
                <Textarea
                  id="freeform"
                  placeholder="I enjoy articles about space exploration, especially those focusing on Mars missions. I also like watching documentaries about wildlife..."
                  className="min-h-[150px] mt-2"
                  value={preferences.freeform}
                  onChange={handleFreeformChange}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {step < 3 ? "Next" : "Finish"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

