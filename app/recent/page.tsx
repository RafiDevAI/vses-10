"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Play, History } from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import { experimentsData } from "@/lib/experiments-data"
import { useRecent } from "@/hooks/use-recent"

const iconMap: Record<string, any> = {
  Planet: Play,
  Beaker: Play,
  Molecule: Play,
  Atom: Play,
  Globe: Play,
  Zap: Play,
}

export default function RecentPage() {
  const { recent } = useRecent()

  const recentExperiments = recent.map((item) => experimentsData.find((exp) => exp.id === item.id)).filter(Boolean)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    return `${days} day${days !== 1 ? "s" : ""} ago`
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Recent Experiments</h2>
              </div>
              <p className="text-muted-foreground">
                {recentExperiments.length === 0
                  ? "You haven't started any experiments yet. Begin exploring!"
                  : `Your ${recentExperiments.length} most recently accessed experiment${recentExperiments.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {recentExperiments.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No recent experiments</CardTitle>
                <CardDescription className="mb-4">
                  Start exploring experiments and they'll appear here for quick access
                </CardDescription>
                <Link href="/experiments">
                  <Button>Browse Experiments</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentExperiments.map((experiment, index) => {
                  if (!experiment) return null
                  const IconComponent = iconMap[experiment.icon as string] || Play
                  const recentItem = recent[index]
                  return (
                    <Card
                      key={experiment.id}
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <Image
                          src={experiment.image || "/placeholder.svg"}
                          alt={experiment.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          {formatTimestamp(recentItem.timestamp)}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <Badge variant="secondary">{experiment.category}</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {experiment.title}
                        </CardTitle>
                        <CardDescription className="text-pretty line-clamp-2">{experiment.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{experiment.duration}</span>
                            </div>
                            <Badge className={getDifficultyColor(experiment.difficulty)} variant="outline">
                              {experiment.difficulty}
                            </Badge>
                          </div>

                          <Link href={`/experiments/${experiment.id}`}>
                            <Button className="w-full">
                              Continue Experiment
                              <Play className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
