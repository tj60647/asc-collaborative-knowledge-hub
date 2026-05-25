"use client"

import { useState } from "react"
import { Plus, Calendar as CalendarIcon, MapPin, Link as LinkIcon, Trash2, Edit, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminCalendarPage() {
  const [isDrafting, setIsDrafting] = useState(false)
  
  const mockPublishedEvents = [
    { id: "1", title: "ASC 2026 Conference", date: "2026-08-03", type: "Conference", status: "published", author: "Admin" },
    { id: "2", title: "Speaker Series: Emergent Territories", date: "2026-06-15", type: "Speaker Series", status: "published", author: "Admin" }
  ]

  const mockDrafts = [
    { id: "3", title: "London Cybernetics Reading Group", date: "2026-07-10", type: "Study Group", status: "draft", author: "Dr. Aris (Member)" },
    { id: "4", title: "Board Meeting Q3", date: "2026-09-01", type: "Internal", status: "draft", author: "Admin" }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-1">Review member requests and manage published calendar events.</p>
        </div>
        <Button onClick={() => setIsDrafting(!isDrafting)}>
          {isDrafting ? "Cancel Draft" : <><Plus className="mr-2 h-4 w-4" /> New Event</>}
        </Button>
      </div>

      {isDrafting && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Draft New Event</CardTitle>
            <CardDescription>Fill out the details below. Events are saved as drafts until published.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input placeholder="e.g., Annual Systems Theory Workshop" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Input type="datetime-local" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location / Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="e.g., Zoom or Vienna, AT" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registration URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="https://..." type="url" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDrafting(false)}>Discard</Button>
              <Button>Save Draft</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="drafts">Pending Requests & Drafts</TabsTrigger>
          <TabsTrigger value="published">Published Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="drafts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Needs Review</CardTitle>
              <CardDescription>Member-submitted events and internal drafts waiting to be published.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDrafts.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          {event.title}
                        </div>
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell className="text-muted-foreground">{event.author}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Publish
                        </Button>
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4 text-blue-600" /></Button>
                        <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Events</CardTitle>
              <CardDescription>Events currently visible on the public calendar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPublishedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4 text-blue-600" /></Button>
                        <Button variant="ghost" size="sm" title="Unpublish (Revert to Draft)">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
