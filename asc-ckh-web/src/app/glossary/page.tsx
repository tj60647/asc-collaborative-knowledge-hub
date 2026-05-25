"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, ArrowRight } from "lucide-react"

// Mock Public Glossary Data (status = 'published')
const mockGlossary = [
  { id: "term-1", title: "Autopoiesis", excerpt: "A system capable of reproducing and maintaining itself.", tags: ["Biology", "Cybernetics", "Systems Theory"] },
  { id: "term-2", title: "Law of Requisite Variety", excerpt: "Only variety can absorb variety. The variety of a controller must be at least as great as the variety of the system to be controlled.", tags: ["Control", "Ashby", "Cybernetics"] },
  { id: "term-3", title: "Second-Order Cybernetics", excerpt: "The cybernetics of cybernetics; acknowledging the observer as part of the system being observed.", tags: ["Constructivism", "Epistemology"] },
]

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = mockGlossary.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Scholarly Glossary</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the foundational concepts of cybernetics, collaboratively defined and curated by the American Society for Cybernetics.
        </p>
        
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search concepts or tags..."
            className="pl-10 py-6 text-lg bg-background rounded-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <Link href="/glossary/submit">
          <Button variant="outline">Propose a Term</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {filtered.map(term => (
          <Card key={term.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">
                  <Link href={`/glossary/${term.id}`} className="hover:underline text-primary">
                    {term.title}
                  </Link>
                </CardTitle>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-muted-foreground">{term.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/20 py-3 border-t">
              <div className="flex flex-wrap gap-2">
                {term.tags.map(tag => (
                  <span key={tag} className="inline-flex text-xs font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/glossary/${term.id}`} className="hidden sm:flex">
                <Button variant="ghost" size="sm">
                  Read Full Entry <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground">
            No terms found matching your search. Try a different query.
          </div>
        )}
      </div>
    </div>
  )
}
