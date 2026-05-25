'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileUpdateSchema } from '@/utils/validations'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get current user session
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Extract form data
  const rawData = {
    title_prefix: formData.get('title_prefix') as string,
    first_name: formData.get('first_name') as string,
    middle_initial: formData.get('middle_initial') as string,
    last_name: formData.get('last_name') as string,
    bio: formData.get('bio') as string,
  }

  // Validate with Zod
  const validatedFields = profileUpdateSchema.safeParse(rawData)

  if (!validatedFields.success) {
    // Return the first validation error message
    const errorMessage = validatedFields.error.errors[0].message
    return { error: `Validation Error: ${errorMessage}` }
  }

  const { title_prefix, first_name, middle_initial, last_name, bio } = validatedFields.data

  // Update the database
  const { error } = await supabase
    .from('user_profiles')
    .update({
      title_prefix: title_prefix || null,
      first_name,
      middle_initial: middle_initial || null,
      last_name,
      bio: bio || null,
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
