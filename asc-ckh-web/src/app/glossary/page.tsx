import { createClient } from '@/utils/supabase/server'
import { GlossaryList } from './glossary-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Scholarly Glossary | ASC',
  description: 'A community-curated dictionary of cybernetics terminology.',
}

export default async function GlossaryPage() {
  const supabase = await createClient()

  // Fetch only published glossary terms
  const { data: terms, error } = await supabase
    .from('knowledge_resources')
    .select(`
      id,
      title,
      content,
      created_at,
      author_id,
      user_profiles (
        first_name,
        last_name,
        title_prefix
      )
    `)
    .eq('type', 'glossary_term')
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching glossary:', error)
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Scholarly Glossary</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mt-2">
            Explore the foundational concepts of cybernetics, collaboratively defined and curated by the American Society for Cybernetics.
          </p>
        </div>
        
        <Link href="/glossary/ask">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ask an Expert
          </Button>
        </Link>
      </div>

      {terms && terms.length > 0 ? (
        <GlossaryList initialTerms={terms as any} />
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No published glossary terms found.</p>
        </div>
      )}
    </div>
  )
}
