"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, MapPin, Video, Plus, ChevronLeft, ChevronRight, List, Columns, Trash2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, subWeeks, addWeeks } from "date-fns"
import { fetchEvents, deleteEvent, createEvent } from "@/lib/api"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)) // Mocking June 2026 for demo sync
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month')
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Auth state
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add Event Form State
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    event_type: 'study_group'
  })

  useEffect(() => {
    async function init() {
      // Get auth
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        // Check role
        try {
          const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', session.user.id).single()
          if (profile?.role === 'Admin' || profile?.role === 'Organizer') {
            setIsAdmin(true)
          }
        } catch (e) {
          // Ignore if user_profiles fetch fails
        }
      }
      
      // Load events
      loadEvents()
    }
    init()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const data = await fetchEvents()
      const sorted = data.sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      setEvents(sorted)
    } catch (err) {
      console.error("Failed to load events", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const nextTime = () => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1))
  const prevTime = () => setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : subWeeks(currentDate, 1))
  const today = () => setCurrentDate(new Date(2026, 5, 1))

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await deleteEvent(id)
      setSelectedEvent(null)
      loadEvents()
    } catch (e) {
      console.error(e)
      alert("Failed to delete event.")
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createEvent({
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      })
      setIsAddEventOpen(false)
      loadEvents()
    } catch (e) {
      console.error(e)
      alert("Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calendar generation logic
  let startDate: Date, endDate: Date
  if (view === 'month') {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    startDate = startOfWeek(monthStart)
    endDate = endOfWeek(monthEnd)
  } else { // week
    startDate = startOfWeek(currentDate)
    endDate = endOfWeek(currentDate)
  }
  
  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (targetDay: Date) => {
    return events.filter(e => isSameDay(parseISO(e.start_time), targetDay))
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "conference": return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
      case "study_group": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
      case "board_meeting": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
      default: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Society Calendar</h1>
          <p className="text-muted-foreground max-w-xl">
            Explore upcoming conferences, speaker series, and study groups across the ASC network.
          </p>
        </div>
        
        {isAdmin ? (
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="datetime-local" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.event_type} onChange={e => setFormData({...formData, event_type: e.target.value})}
                  >
                    <option value="conference">Conference</option>
                    <option value="study_group">Study Group</option>
                    <option value="speaker_series">Speaker Series</option>
                    <option value="board_meeting">Board Meeting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Event"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Link href="/calendar/request" className={buttonVariants({ className: "shrink-0 bg-primary" })}>
            <Plus className="mr-2 h-4 w-4" /> Propose Event
          </Link>
        )}
      </div>

      <div className="bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/40">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-4">
            {view === 'agenda' ? "Upcoming Events" : (view === 'week' ? `Week of ${format(startDate, "MMM d, yyyy")}` : format(currentDate, "MMMM yyyy"))}
            {isLoading && <span className="text-sm font-medium text-foreground animate-pulse">Loading...</span>}
          </h2>
          <div className="flex items-center gap-4">
            
            <div className="flex items-center border rounded-md overflow-hidden bg-background">
              <Button variant="ghost" size="sm" onClick={() => setView('month')} className={`rounded-none px-3 ${view === 'month' ? 'bg-muted font-medium' : ''}`}>
                <CalendarIcon className="w-4 h-4 mr-2 hidden sm:inline" /> Month
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView('week')} className={`rounded-none px-3 border-l ${view === 'week' ? 'bg-muted font-medium' : ''}`}>
                <Columns className="w-4 h-4 mr-2 hidden sm:inline" /> Week
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView('agenda')} className={`rounded-none px-3 border-l ${view === 'agenda' ? 'bg-muted font-medium' : ''}`}>
                <List className="w-4 h-4 mr-2 hidden sm:inline" /> Agenda
              </Button>
            </div>

            {view !== 'agenda' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={today}>Today</Button>
                <div className="flex items-center border rounded-md overflow-hidden bg-background">
                  <Button variant="ghost" size="icon" onClick={prevTime} className="rounded-none border-r hover:bg-muted" aria-label="Previous"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={nextTime} className="rounded-none hover:bg-muted" aria-label="Next"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {view === 'agenda' ? (
          <div className="divide-y">
            {events.length === 0 && !isLoading && (
              <div className="p-8 text-center text-muted-foreground">No upcoming events found.</div>
            )}
            {events.map(event => (
              <div key={event.id} className="p-4 hover:bg-muted/10 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-muted-foreground">
                  {format(parseISO(event.start_time), "MMM d, yyyy")}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg cursor-pointer hover:underline" onClick={() => setSelectedEvent(event)}>{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${getEventBadgeColor(event.event_type)}`}>
                      {event.event_type?.replace('_', ' ') || 'Event'}
                    </span>
                    <span className="flex items-center gap-1">
                      {event.location?.toLowerCase().includes('zoom') ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {event.location}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>Details</Button>
              </div>
            ))}
          </div>
        ) : view === 'week' ? (
          /* Strict Vertical Time-Grid Week View (Like Google Calendar) */
          <div className="flex flex-col h-[600px] overflow-hidden">
            {/* Days of week Header */}
            <div className="flex border-b bg-muted/20">
              <div className="w-16 flex-shrink-0 border-r bg-muted/10"></div>
              <div className="flex-1 grid grid-cols-7">
                {days.slice(0, 7).map(day => (
                  <div key={day.toString()} className="py-2 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider border-r last:border-r-0">
                    <span className="hidden md:inline">{format(day, 'E')}</span>
                    <span className="md:hidden">{format(day, 'EEEEE')}</span>
                    <div className={`text-lg mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full ${isSameDay(day, new Date(2026, 5, 1)) ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Time Grid */}
            <div className="flex flex-1 overflow-y-auto">
              <div className="w-16 flex-shrink-0 border-r bg-muted/5 relative">
                {HOURS.map(hour => (
                  <div key={hour} className="h-16 border-b text-right pr-2 text-xs text-muted-foreground pt-1 relative -top-3">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7">
                {days.map((day, i) => {
                  const dayEvents = getEventsForDay(day)
                  return (
                    <div key={i} className="relative border-r last:border-r-0 border-b min-h-[1536px]">
                      {/* Hour grid lines */}
                      {HOURS.map(hour => (
                        <div key={hour} className="h-16 border-b border-border/40 pointer-events-none"></div>
                      ))}
                      {/* Events Absolutely Positioned */}
                      {dayEvents.map(event => {
                        const start = parseISO(event.start_time)
                        const end = event.end_time ? parseISO(event.end_time) : new Date(start.getTime() + 60 * 60 * 1000) // Default 1 hr duration
                        const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                        // 1 hr = 4rem = 64px
                        const topOffset = (start.getHours() + start.getMinutes() / 60) * 64 
                        const height = Math.max(durationHrs * 64, 24) // Minimum height 24px
                        
                        return (
                          <div 
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`absolute left-1 right-1 rounded p-1.5 text-[10px] leading-tight border overflow-hidden cursor-pointer shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] ${getEventBadgeColor(event.event_type)}`}
                            style={{ top: `${topOffset}px`, height: `${height}px` }}
                            title={event.title}
                          >
                            <div className="font-semibold truncate">{format(start, "h:mm a")}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Month View Header */}
            <div className="grid grid-cols-7 border-b bg-muted/20">
              {days.slice(0, 7).map(day => (
                <div key={day.toString()} className="py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <span className="hidden md:inline">{format(day, 'E')}</span>
                  <span className="md:hidden">{format(day, 'EEEEE')}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-border gap-px">
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date(2026, 5, 1))

                return (
                  <div 
                    key={i} 
                    className={`min-h-[120px] p-2 bg-card transition-colors hover:bg-muted/30 ${
                      !isCurrentMonth ? "bg-muted/10 text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    <div className="flex justify-end mb-2">
                      <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${
                        isToday ? "bg-primary text-primary-foreground" : (!isCurrentMonth ? "text-zinc-600 dark:text-zinc-300" : "")
                      }`}>
                        {format(day, "d")}
                      </span>
                    </div>
                    <div className="space-y-1.5 mt-1">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`text-xs px-2 py-1.5 rounded-md border truncate cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${getEventBadgeColor(event.event_type)}`}
                          title={event.title}
                        >
                          <div className="font-semibold">{format(parseISO(event.start_time), "h:mm a")}</div>
                          <div className="truncate">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Event Details Sheet */}
      <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedEvent && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${getEventBadgeColor(selectedEvent.event_type)}`}>
                    {selectedEvent.event_type?.replace('_', ' ') || 'Event'}
                  </span>
                  {isAdmin && (
                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDelete(selectedEvent.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <SheetTitle className="text-2xl pt-2">{selectedEvent.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-2 font-medium">
                  <CalendarIcon className="w-4 h-4" /> {format(parseISO(selectedEvent.start_time), "EEEE, MMMM d, yyyy")}
                </SheetDescription>
                <SheetDescription className="flex items-center gap-2 font-medium">
                  <List className="w-4 h-4" /> {format(parseISO(selectedEvent.start_time), "h:mm a")} - {format(parseISO(selectedEvent.end_time || selectedEvent.start_time), "h:mm a")}
                </SheetDescription>
                <SheetDescription className="flex items-center gap-2 font-medium text-foreground">
                  {selectedEvent.location?.toLowerCase().includes('zoom') ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  {selectedEvent.location}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert">
                  <h3 className="text-lg font-semibold border-b pb-2">Description</h3>
                  <p className="whitespace-pre-wrap">{selectedEvent.description || "No description provided."}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  )
}
