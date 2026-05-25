'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get current user session
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Extract form data
  const title_prefix = formData.get('title_prefix') as string
  const first_name = formData.get('first_name') as string
  const middle_initial = formData.get('middle_initial') as string
  const last_name = formData.get('last_name') as string
  const bio = formData.get('bio') as string

  // Note: Discoverability opt-in isn't in our schema yet, but for now we just handle the text fields
  
  // Update the database
  const { error } = await supabase
    .from('user_profiles')
    .update({
      title_prefix: title_prefix || null,
      first_name,
      middle_initial: middle_initial || null,
      last_name,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Refresh the UI cache
  revalidatePath('/profile')
  
  return { success: true }
}
