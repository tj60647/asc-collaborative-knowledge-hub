"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, MapPin, Video, Plus, ChevronLeft, ChevronRight, List } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns"
import { fetchEvents } from "@/lib/api"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)) // Mocking June 2026 for demo sync
  const [view, setView] = useState<'month' | 'agenda'>('month')
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await fetchEvents('published')
        // Sort events chronologically
        const sorted = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        setEvents(sorted)
      } catch (err) {
        console.error("Failed to load events", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const today = () => setCurrentDate(new Date(2026, 5, 1))

  // Calendar generation logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  
  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const getEventsForDay = (targetDay: Date) => {
    return events.filter(e => isSameDay(parseISO(e.date), targetDay))
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "Conference": return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
      case "Working Group": return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
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
        
        <Link href="/calendar/request" className={buttonVariants({ className: "shrink-0 bg-primary" })}>
          <Plus className="mr-2 h-4 w-4" /> Propose Event
        </Link>
      </div>

      <div className="bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/40">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-4">
            {view === 'month' ? format(currentDate, "MMMM yyyy") : "Upcoming Events"}
            {isLoading && <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>}
          </h2>
          <div className="flex items-center gap-4">
            
            <div className="flex items-center border rounded-md overflow-hidden bg-background">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setView('month')} 
                className={`rounded-none px-4 ${view === 'month' ? 'bg-muted font-medium' : ''}`}
              >
                <CalendarIcon className="w-4 h-4 mr-2" /> Month
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setView('agenda')} 
                className={`rounded-none px-4 border-l ${view === 'agenda' ? 'bg-muted font-medium' : ''}`}
              >
                <List className="w-4 h-4 mr-2" /> Agenda
              </Button>
            </div>

            {view === 'month' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={today}>Today</Button>
                <div className="flex items-center border rounded-md overflow-hidden bg-background">
                  <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-none border-r hover:bg-muted"><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-none hover:bg-muted"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {view === 'month' ? (
          <>
            {/* Days of week */}
            <div className="grid grid-cols-7 border-b bg-muted/20">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-border gap-px">
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, monthStart)
                const isToday = isSameDay(day, new Date(2026, 5, 1))

                return (
                  <div 
                    key={i} 
                    className={`min-h-[120px] p-2 bg-card transition-colors hover:bg-muted/30 ${
                      !isCurrentMonth ? "bg-muted/10 text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    <div className="flex justify-end mb-1">
                      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday ? "bg-primary text-primary-foreground" : ""
                      }`}>
                        {format(day, "d")}
                      </span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded-md border truncate cursor-pointer ${getEventBadgeColor(event.type)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          /* Agenda View */
          <div className="divide-y">
            {events.length === 0 && !isLoading && (
              <div className="p-8 text-center text-muted-foreground">No upcoming events found.</div>
            )}
            {events.map(event => (
              <div key={event.id} className="p-4 hover:bg-muted/10 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex-shrink-0 w-32 text-sm font-medium text-muted-foreground">
                  {format(parseISO(event.date), "MMM d, yyyy")}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full border text-xs ${getEventBadgeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="flex items-center gap-1">
                      {event.location?.toLowerCase().includes('zoom') ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {event.location}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
