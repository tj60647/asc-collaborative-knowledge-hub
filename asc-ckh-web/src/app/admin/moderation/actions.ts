'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function answerQuestion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check admin/moderator role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile.role)) {
    return { error: 'Forbidden' }
  }

  const questionId = formData.get('question_id') as string
  const answer = formData.get('answer') as string

  if (!questionId || !answer || answer.trim().length < 5) {
    return { error: 'Invalid input' }
  }

  const { error } = await supabase
    .from('expert_questions')
    .update({
      status: 'answered',
      answer: answer.trim(),
      answered_by: user.id
    })
    .eq('id', questionId)

  if (error) return { error: error.message }

  revalidatePath('/admin/moderation')
  revalidatePath('/glossary')
  
  return { success: true }
}

export async function rejectQuestion(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check admin/moderator role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'moderator'].includes(profile.role)) {
    return { error: 'Forbidden' }
  }

  const questionId = formData.get('question_id') as string
  const reason = formData.get('reason') as string

  if (!questionId) return { error: 'Invalid input' }

  // We save the reason in the "answer" field for rejected questions, 
  // or we could just set status to rejected. Let's just set status to rejected for now.
  const { error } = await supabase
    .from('expert_questions')
    .update({
      status: 'rejected',
      answer: reason ? `Rejected Reason: ${reason}` : 'Inappropriate content',
      answered_by: user.id
    })
    .eq('id', questionId)

  if (error) return { error: error.message }

  revalidatePath('/admin/moderation')
  return { success: true }
}
