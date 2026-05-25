"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye } from "lucide-react"

// Mock data representing public.resources where status = 'review'
const mockReviewQueue = [
  { id: "1", title: "Law of Requisite Variety", type: "glossary_term", author: "Jane Scholar", submittedAt: "2024-03-12" },
  { id: "2", title: "Autopoiesis", type: "glossary_term", author: "Dr. Maturana", submittedAt: "2024-03-14" },
  { id: "3", title: "Cybernetics of Cybernetics", type: "publication", author: "ASC Archive", submittedAt: "2024-03-15" }
]

export default function CurationQueuePage() {
  const [queue, setQueue] = useState(mockReviewQueue)

  const handleAction = (id: string, action: 'publish' | 'reject') => {
    // Simulate updating public.resources status -> 'published' or 'draft'
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Editorial Curation Queue</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>
            Review community-submitted resources. Approved items are immediately published. Rejected items are returned to the author as drafts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border rounded-md bg-muted/20">
              The curation queue is currently empty.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="capitalize">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {item.type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" title="Preview Content">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleAction(item.id, 'reject')}
                          title="Reject / Return to Draft"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAction(item.id, 'publish')}
                          title="Approve & Publish"
                        >
                          <Check className="h-4 w-4 mr-1" /> Publish
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
