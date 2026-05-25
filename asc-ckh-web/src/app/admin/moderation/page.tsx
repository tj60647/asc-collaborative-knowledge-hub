import { createClient } from '@/utils/supabase/server'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Shield, CheckCircle2, XCircle, MessageCircleQuestion } from "lucide-react"
import { ModerationList } from './moderation-list'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Moderation Dashboard | ASC Admin',
}

export default async function ModerationDashboard() {
  const supabase = await createClient()

  // 1. Check permissions
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile.role)) {
    redirect('/dashboard') // Or some unauthorized page
  }

  // 2. Fetch Pending Questions
  const { data: questions, error } = await supabase
    .from('expert_questions')
    .select(`
      id,
      question,
      created_at,
      status,
      user_profiles!expert_questions_author_id_fkey (
        first_name,
        last_name,
        title_prefix
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moderation Dashboard</h1>
          <p className="text-muted-foreground">
            Review and answer questions submitted by members. Filter out inappropriate content.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5" />
              Pending Questions
            </CardTitle>
            <CardDescription>
              Questions waiting for an expert answer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questions && questions.length > 0 ? (
              <ModerationList questions={questions} />
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-green-500/50" />
                <p>No pending questions. You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Academic Rigor:</strong> Please ensure answers meet the high academic standards of the American Society for Cybernetics.
              </p>
              <p>
                <strong>Inappropriate Content:</strong> If a question is spam, trolling, or violates community guidelines, use the <span className="text-destructive font-medium">Reject</span> action. The user will be notified of the reason.
              </p>
              <p>
                <strong>Publishing:</strong> Answered questions become visible on the public glossary for all members to learn from.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
