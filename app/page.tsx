// We need to split this into a Server Component (for fetching) and Client Component (for state)
// app/page.tsx will be the Server Component
// components/Dashboard.tsx will be the Client Component

import { createClient } from '@/utils/supabase/server'
import Dashboard from '@/components/Dashboard'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return <Dashboard tasks={tasks || []} user={user} />
}
