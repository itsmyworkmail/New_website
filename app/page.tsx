// We need to split this into a Server Component (for fetching) and Client Component (for state)
// app/page.tsx will be the Server Component
// components/Dashboard.tsx will be the Client Component

import Dashboard from '@/components/Dashboard'

export default function Home() {
  return <Dashboard />
}
