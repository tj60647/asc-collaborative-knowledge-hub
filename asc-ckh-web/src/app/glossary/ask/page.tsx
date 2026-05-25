'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircleQuestion, AlertCircle, CheckCircle2 } from "lucide-react"
import { submitQuestion } from '../actions'
import Link from 'next/link'

export default function AskQuestionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await submitQuestion(formData)
    
    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-green-50 text-green-700 p-8 rounded-lg border border-green-200">
          <CheckCircle2 className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Question Submitted!</h2>
          <p className="mb-6">Thank you for your question. Our experts will review it and provide an answer soon.</p>
          <Link href="/glossary">
            <Button variant="outline">Back to Glossary</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12 px-4">
      <div>
        <Link href="/glossary" className="text-primary hover:underline text-sm mb-4 inline-block">
          &larr; Back to Glossary
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Ask an Expert</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Submit a question about cybernetics concepts or terminology.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5 text-primary" />
              Your Question
            </CardTitle>
            <CardDescription>
              Our academic board and experts review these questions. High-quality answers may be published to the glossary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {error && (
              <div className="flex items-start gap-2 p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="question">What would you like to know?</Label>
              <Textarea 
                id="question" 
                name="question" 
                placeholder="e.g., Can someone clarify the difference between structural coupling and autopoiesis?" 
                className="min-h-[150px]"
                required 
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">Maximum 500 characters.</p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-4 bg-muted/20 border-t py-4">
            <Link href="/glossary">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
