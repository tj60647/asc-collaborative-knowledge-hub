'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (password !== confirmPassword) {
    redirect('/auth/update-password?message=Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/auth/update-password?message=Could not update password')
  }

  redirect('/profile')
}
