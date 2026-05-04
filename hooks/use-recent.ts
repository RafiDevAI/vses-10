"use client"

import { useState, useEffect } from "react"

interface RecentExperiment {
  id: string
  timestamp: number
}

export function useRecent() {
  const [recent, setRecent] = useState<RecentExperiment[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("recent")
    if (stored) {
      setRecent(JSON.parse(stored))
    }
  }, [])

  const addRecent = (experimentId: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((item) => item.id !== experimentId)
      const newRecent = [{ id: experimentId, timestamp: Date.now() }, ...filtered].slice(0, 10)
      localStorage.setItem("recent", JSON.stringify(newRecent))
      return newRecent
    })
  }

  const getRecentIds = () => recent.map((item) => item.id)

  return { recent, addRecent, getRecentIds }
}
