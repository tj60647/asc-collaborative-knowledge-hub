"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Send, CheckCircle2 } from "lucide-react"

export default function SubmitGlossaryTerm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API submission inserting into `public.resources` 
    // with type='glossary_term' and status='review'
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
    }, 1000)
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-200 bg-green-50/50">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-bold text-green-900">Term Submitted</h2>
            <p className="text-green-800 text-sm">
              Thank you for contributing to the ASC Glossary. Your submission has been placed in the review queue. 
              Once a moderator approves it, it will be published to the public glossary.
            </p>
            <Button onClick={() => { setSuccess(false); setFormData({title: '', content: ''}) }} variant="outline" className="mt-4">
              Submit Another Term
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center p-4 pt-12">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propose a Glossary Term</h1>
          <p className="text-muted-foreground mt-2">Contribute to the foundational scholarly material of the Society.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Term Details</CardTitle>
              </div>
              <CardDescription>
                All submissions are reviewed by the Editorial Board prior to publication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Term or Concept</Label>
                <Input 
                  id="title" 
                  name="title" 
                  required 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="e.g., Second-Order Cybernetics"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Definition & Context</Label>
                <textarea 
                  id="content" 
                  name="content"
                  required
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Provide the definition, historical context, and any relevant citations..."
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-6">
              <Button type="submit" disabled={isSubmitting || !formData.title || !formData.content} className="w-full sm:w-auto">
                {isSubmitting ? "Submitting..." : "Submit to Review Queue"}
                {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
