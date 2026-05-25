import { createClient } from '@/utils/supabase/server'
import { GlossaryList } from './glossary-list'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Scholarly Glossary | ASC',
  description: 'An expert-curated dictionary of cybernetics terminology, defined by the American Society for Cybernetics.',
}

export default async function GlossaryPage() {
  const supabase = await createClient()

  // Step 1: Fetch published glossary terms — NO join to avoid PostgREST
  // cross-join ambiguity caused by the triangular FK path:
  //   knowledge_resources → user_profiles (via author_id)
  //   knowledge_resources → safety_reports → user_profiles (via reporter_id)
  const { data: terms, error } = await supabase
    .from('knowledge_resources')
    .select('id, title, content, created_at, author_id')
    .eq('type', 'glossary_term')
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching glossary terms:', error)
  }

  // Step 2: Batch-fetch author profiles for the unique author_ids we collected
  const authorIds = [...new Set((terms ?? []).map((t) => t.author_id).filter(Boolean))]

  const profileMap: Record<string, { first_name: string; last_name: string; title_prefix: string | null }> = {}

  if (authorIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, title_prefix')
      .in('id', authorIds)

    if (profileError) {
      console.error('Error fetching author profiles:', profileError)
    }

    for (const p of profiles ?? []) {
      profileMap[p.id] = { first_name: p.first_name, last_name: p.last_name, title_prefix: p.title_prefix }
    }
  }

  // Step 3: Merge profiles into terms and deduplicate (safety net)
  const uniqueTerms = Array.from(
    new Map((terms ?? []).map((t) => [t.id, t])).values()
  ).map((t) => ({
    ...t,
    user_profiles: profileMap[t.author_id] ?? null,
  }))

  return (
    <div className="relative flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Scholarly Glossary</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mt-2">
          Foundational concepts of cybernetics, curated and defined by ASC experts.
        </p>
      </div>

      {uniqueTerms.length > 0 ? (
        <GlossaryList initialTerms={uniqueTerms as any} />
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No published glossary terms found.</p>
        </div>
      )}

      {/* Ask an Expert FAB — accessible from any scroll position */}
      <Link
        href="/glossary/ask"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 px-4 py-3 rounded-full shadow-lg text-sm font-medium transition-all hover:scale-105"
      >
        <BookOpen className="h-4 w-4" />
        Ask an Expert
      </Link>
    </div>
  )
}
