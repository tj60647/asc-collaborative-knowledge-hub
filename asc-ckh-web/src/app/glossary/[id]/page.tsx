"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Network } from "lucide-react"

// Mock Public Glossary DB
const mockDB: Record<string, any> = {
  "term-1": { title: "Autopoiesis", content: "A system capable of reproducing and maintaining itself. Originally introduced by Humberto Maturana and Francisco Varela in 1972 to define the chemistry of living systems. Since then, it has been applied to cognition, systems theory, and sociology.", author: "Dr. Maturana", date: "2024-01-15", tags: ["Biology", "Cybernetics", "Systems Theory"] },
  "term-2": { title: "Law of Requisite Variety", content: "Only variety can absorb variety. The variety of a controller must be at least as great as the variety of the system to be controlled.", author: "John Ashby", date: "2024-02-10", tags: ["Control", "Ashby", "Cybernetics"] },
  "term-3": { title: "Second-Order Cybernetics", content: "The cybernetics of cybernetics; acknowledging the observer as part of the system being observed.", author: "Jane Scholar", date: "2024-03-05", tags: ["Constructivism", "Epistemology"] }
}

// Mock Graph Relationships Engine
const getRelatedResources = (currentTermId: string, tags: string[]) => {
  const related = []
  for (const [id, data] of Object.entries(mockDB)) {
    if (id !== currentTermId) {
      const sharedTags = data.tags.filter((t: string) => tags.includes(t))
      if (sharedTags.length > 0) {
        related.push({ id, title: data.title, sharedTags })
      }
    }
  }
  return related
}

export default function GlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const term = mockDB[resolvedParams.id]

  if (!term) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Term Not Found</h1>
        <Link href="/glossary">
          <Button>Return to Glossary</Button>
        </Link>
      </div>
    )
  }

  const relatedResources = getRelatedResources(resolvedParams.id, term.tags)

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <Link href="/glossary" className="inline-block mb-2 -ml-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Button>
        </Link>

        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{term.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Authored by: {term.author}</span>
            <span>Published: {term.date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 py-2">
          {term.tags.map((tag: string) => (
            <span key={tag} className="inline-flex text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none border-t pt-6 mt-6">
          <p>{term.content}</p>
        </div>
      </div>

      {/* Graph Discovery Sidebar */}
      <div className="w-full md:w-80 space-y-6">
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-lg">Graph Discovery</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Related Concepts</h3>
            {relatedResources.length > 0 ? (
              <ul className="space-y-4">
                {relatedResources.map(res => (
                  <li key={res.id}>
                    <Link href={`/glossary/${res.id}`} className="block group">
                      <div className="font-medium text-primary group-hover:underline mb-1">{res.title}</div>
                      <div className="text-xs text-muted-foreground flex gap-1 items-center">
                        Shared: <span className="bg-muted px-1.5 rounded">{res.sharedTags.join(', ')}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No directly related concepts found in the graph.</p>
            )}
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full">
          <Share2 className="mr-2 h-4 w-4" /> Share this Definition
        </Button>
      </div>
    </div>
  )
}
