'use client'

import Dashboard from '@/components/Dashboard'

export default function TestDashboard() {
    const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        user_metadata: {
            full_name: 'Test User',
            avatar_url: null
        }
    }

    const mockTasks = [
        {
            id: '1',
            title: 'Active Task 1',
            description: 'This is an active task desc',
            is_completed: false,
            is_starred: false,
            list_type: 'Personal',
            due_date: '2024-12-25',
            due_time: '10:00'
        },
        {
            id: '2',
            title: 'Active Task 2',
            description: 'Another active task',
            is_completed: false,
            is_starred: true,
            list_type: 'Work',
            due_date: '2024-12-26',
        },
        {
            id: '3',
            title: 'Completed Task',
            description: 'This task is already done',
            is_completed: true,
            is_starred: false,
            list_type: 'Personal',
        },
        {
            id: '4',
            title: 'Another Task for Grid',
            description: 'Testing the grid layout with multiple cards',
            is_completed: false,
            is_starred: false,
            list_type: 'Work',
            due_date: '2024-12-28',
        }
    ]

    return (
        <Dashboard tasks={mockTasks} user={mockUser} />
    )
}
