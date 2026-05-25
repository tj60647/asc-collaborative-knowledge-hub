"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, MapPin, Link as LinkIcon, Info, Send, ArrowLeft } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function EventRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate database insertion with status = 'draft'
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1200)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CalendarIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Event Requested</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for proposing an event to the ASC community. Our operations team will review your draft and publish it to the calendar shortly.
        </p>
        <Link href="/calendar" className={buttonVariants({ variant: "default" })}>Return to Calendar</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/calendar" className={buttonVariants({ variant: "ghost", className: "mb-4 -ml-4" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Calendar
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Propose an Event</h1>
        <p className="text-muted-foreground mt-2">
          Submit a study group, local meetup, or virtual dialogue to the official ASC calendar.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Your proposal will be saved as a draft for admin review before being published.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
              <Input id="title" required placeholder="e.g., London Cybernetics Reading Group" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <select 
                id="type"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option>Study Group</option>
                <option>Local Meetup</option>
                <option>Virtual Dialogue</option>
                <option>Conference / Symposium</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date & Time <span className="text-red-500">*</span></Label>
                <Input id="start" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Date & Time <span className="text-red-500">*</span></Label>
                <Input id="end" type="datetime-local" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location / Venue <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="location" className="pl-8" required placeholder="e.g., Zoom or Vienna, AT" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Registration / Link URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="url" className="pl-8" placeholder="https://..." type="url" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description (Summary) <span className="text-red-500">*</span></Label>
              <Input 
                id="short_description" 
                required 
                placeholder="A one-sentence summary for the calendar grid." 
                maxLength={120}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Long Description (Details) <span className="text-red-500">*</span></Label>
              <textarea 
                id="long_description"
                required
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="What will be discussed? Who is the intended audience? (Markdown supported)"
              />
            </div>
            
            <div className="rounded-md bg-muted p-4 flex gap-3 text-sm text-muted-foreground">
              <Info className="h-5 w-5 shrink-0" />
              <p>As the proposer, you will be listed as the event organizer on the public calendar once approved.</p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end border-t p-6 bg-muted/10">
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Submitting Draft..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
