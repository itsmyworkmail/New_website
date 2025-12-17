'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function TestHeader() {
    const mockUser = {
        email: 'test@example.com',
        user_metadata: {
            full_name: 'Google User',
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        }
    }

    const [filter, setFilter] = useState<'all' | 'starred'>('all')

    return (
        <div className="flex bg-background h-screen">
            <Sidebar
                onAddTask={() => console.log('Add Task')}
                currentFilter={filter}
                setFilter={setFilter}
            />
            <div className="flex-1 flex flex-col">
                <Header user={mockUser} />
                <div className="p-10 text-foreground transition-colors duration-300">
                    <h1 className="text-4xl font-bold mb-4">UI Verification</h1>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>**Sidebar**: Should be fixed width (collapsed only). No hamburger menu.</li>
                        <li>**Tooltips**: Hover over Sidebar icons (+, List, Star) and Header Theme Toggle to see tooltips.</li>
                        <li>**Theme**: Toggle still works.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
