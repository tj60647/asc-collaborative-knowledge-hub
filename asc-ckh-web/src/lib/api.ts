import { supabase } from './supabase'

// Mock Data Fallback for Prototype Mode
const MOCK_EVENTS = [
  { 
    id: "evt-1", 
    title: "ASC 2026 Conference: Conversational Confluences", 
    short_description: "The premier global gathering for systems thinkers and cyberneticians.",
    long_description: "Join us in Ouro Preto for 5 days of intense workshops, dialogue mapping, and exploring how cybernetic principles apply to modern global crises.",
    metadata: { ticketing_url: "https://eventbrite.com/...", accessibility: "Wheelchair accessible" },
    date: new Date(2026, 7, 3).toISOString(), 
    location: "Ouro Preto, Brazil",
    type: "Conference",
    status: "published",
    author: "Admin"
  },
  { 
    id: "evt-2", 
    title: "Speaker Series: Emergent Territories", 
    short_description: "A virtual deep dive into emergent behavior in complex systems.",
    long_description: "Dr. Maria Sousa will present her latest findings on cellular automata and urban planning. Q&A to follow.",
    metadata: { recording_available_post_event: true },
    date: new Date(2026, 5, 15).toISOString(), 
    location: "Zoom",
    type: "Speaker Series",
    status: "published",
    author: "Admin"
  },
  { 
    id: "evt-3", 
    title: "London Cybernetics Reading Group", 
    short_description: "Discussing Stafford Beer's 'Designing Freedom'.",
    long_description: "Our monthly local meetup. We will be reading chapters 1-3. All are welcome, regardless of prior cybernetics knowledge.",
    metadata: { capacity: 20 },
    date: new Date(2026, 6, 10).toISOString(), 
    location: "London, UK",
    type: "Study Group",
    status: "draft",
    author: "Dr. Aris"
  }
]

// Initialize LocalStorage for prototyping if no Supabase URL is set
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL

const getLocalEvents = () => {
  if (typeof window === 'undefined') return MOCK_EVENTS
  const stored = localStorage.getItem('ckh_events')
  if (!stored) {
    localStorage.setItem('ckh_events', JSON.stringify(MOCK_EVENTS))
    return MOCK_EVENTS
  }
  return JSON.parse(stored)
}

const saveLocalEvents = (events: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ckh_events', JSON.stringify(events))
  }
}

export async function fetchEvents(statusFilter?: 'published' | 'draft') {
  if (!isMockMode) {
    let query = supabase.from('community_events').select('*')
    if (statusFilter) query = query.eq('status', statusFilter)
    const { data, error } = await query
    if (error) throw error
    return data
  } else {
    // Mock Mode
    await new Promise(r => setTimeout(r, 400)) // simulate network
    const events = getLocalEvents()
    if (statusFilter) return events.filter((e: any) => e.status === statusFilter)
    return events
  }
}

export async function createEvent(eventData: any) {
  let embedding = null;

  // 1. Generate the embedding via our secure backend route
  try {
    const embedRes = await fetch('/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    
    if (embedRes.ok) {
      const data = await embedRes.json();
      embedding = data.embedding;
      console.log(`Generated embedding vector of length: ${embedding?.length}`);
    } else {
      console.error("Failed to generate embedding", await embedRes.text());
    }
  } catch (err) {
    console.error("Error calling /api/embed:", err);
  }

  // 2. Attach embedding to payload
  const payload = { ...eventData, embedding };

  // 3. Save to Database (or mock fallback)
  if (!isMockMode) {
    const { data, error } = await supabase.from('community_events').insert([payload]).select()
    if (error) throw error
    return data
  } else {
    // Mock Mode
    await new Promise(r => setTimeout(r, 600))
    const events = getLocalEvents()
    const newEvent = { ...payload, id: `evt-${Date.now()}` }
    saveLocalEvents([...events, newEvent])
    return [newEvent]
  }
}

export async function updateEventStatus(id: string, newStatus: string) {
  if (!isMockMode) {
    const { data, error } = await supabase.from('community_events').update({ status: newStatus }).eq('id', id).select()
    if (error) throw error
    return data
  } else {
    // Mock Mode
    await new Promise(r => setTimeout(r, 400))
    const events = getLocalEvents()
    const updated = events.map((e: any) => e.id === id ? { ...e, status: newStatus } : e)
    saveLocalEvents(updated)
    return updated.filter((e: any) => e.id === id)
  }
}
