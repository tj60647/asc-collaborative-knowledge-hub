'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Quote } from "lucide-react"

type Term = {
  id: string
  title: string
  content: string
  created_at: string
  author_id: string
  user_profiles: {
    first_name: string
    last_name: string
    title_prefix: string | null
  } | null
}

export function GlossaryList({ initialTerms }: { initialTerms: Term[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = initialTerms.filter(term => 
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search glossary..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map(term => {
          const author = term.user_profiles
          const authorName = author 
            ? `${author.title_prefix ? author.title_prefix + ' ' : ''}${author.first_name} ${author.last_name}`
            : 'Unknown Member'

          return (
            <Card key={term.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    {term.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Quote className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                  <p className="text-foreground leading-relaxed">{term.content}</p>
                </div>
                <div className="text-xs text-muted-foreground flex justify-end">
                  Submitted by {authorName}
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {filtered.length === 0 && (
          <div className="text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground">
            No terms found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  )
}
