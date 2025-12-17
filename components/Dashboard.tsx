'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import TaskModal from '@/components/TaskModal'
import TaskCard from '@/components/TaskCard'

export default function Dashboard({ tasks, user }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { tasks: any[], user: any }) {
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [filter, setFilter] = useState<'all' | 'starred' | 'completed'>('all')

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.is_completed
        // For 'all' and 'starred', we generally want to hide completed tasks
        // unless the user specifically asks for 'completed' view.
        // Assuming 'is_completed' field exists. If not present in DB yet, this checks undefined which is falsy (safe).
        if (task.is_completed) return false

        if (filter === 'starred') return task.is_starred
        return true
    })

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar now controls the view filter */}
            <Sidebar
                onAddTask={() => setShowTaskModal(true)}
                currentFilter={filter}
                setFilter={setFilter}
            />

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <Header user={user} />

                <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold capitalize">{filter === 'all' ? 'My Tasks' : filter + ' Tasks'}</h1>
                        <p className="text-muted-foreground mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-white/5">
                                <p>No {filter} tasks found</p>
                                <button onClick={() => setShowTaskModal(true)} className="mt-2 text-primary hover:underline">
                                    Create a new task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <TaskModal
                    isOpen={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                />
            </main>
        </div>
    )
}
