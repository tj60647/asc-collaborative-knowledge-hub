'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { questionSchema } from '@/utils/validations'

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient()

  // Get current user session
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Extract form data
  const rawData = {
    question: formData.get('question') as string,
  }

  // Validate with Zod
  const validatedFields = questionSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0].message
    return { error: `Validation Error: ${errorMessage}` }
  }

  const { question } = validatedFields.data

  // Insert into database with status = 'pending'
  const { error } = await supabase
    .from('expert_questions')
    .insert({
      question,
      author_id: user.id,
      status: 'pending',
    })

  if (error) {
    return { error: error.message }
  }

  // Refresh the UI cache
  revalidatePath('/glossary')
  revalidatePath('/admin/moderation')
  
  return { success: true }
}
