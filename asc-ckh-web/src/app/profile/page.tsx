import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  // 2. Fetch profile data securely
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('title_prefix, first_name, middle_initial, last_name, bio')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error("Could not fetch profile:", profileError)
    // Handle error or fallback gracefully
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Scholar Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your public identity and discoverability settings.</p>
      </div>

      <ProfileForm initialData={profileData || { 
        title_prefix: null, 
        first_name: '', 
        middle_initial: null, 
        last_name: '', 
        bio: null 
      }} />

    </div>
  )
}
