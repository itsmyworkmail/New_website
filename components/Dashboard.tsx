'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import TaskModal from '@/components/TaskModal'
import TaskCard from '@/components/TaskCard'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tasks, setTasks] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [filter, setFilter] = useState<'all' | 'starred' | 'completed'>('all')
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError || !user) {
                router.push('/login')
                return
            }
            setUser(user)

            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })

            if (tasksData) {
                setTasks(tasksData)
            }
            setLoading(false)
        }
        fetchData()
    }, [router, supabase])

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.is_completed
        if (task.is_completed) return false
        if (filter === 'starred') return task.is_starred
        return true
    })

    const handleUpdateTask = (updatedTask: any) => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId))
    }

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Sidebar now controls the view filter */}
            <Sidebar
                onAddTask={() => setShowTaskModal(true)}
                currentFilter={filter}
                setFilter={setFilter}
                user={user}
            />

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <Header user={user} filter={filter} />

                <div className="flex-1 overflow-auto p-4 sm:p-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onUpdateTask={handleUpdateTask}
                                    onDeleteTask={handleDeleteTask}
                                />
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
                    onClose={() => {
                        setShowTaskModal(false)
                        // Refresh tasks after modal close (simple way)
                        // A better way would be to pass a callback to refresh or use context
                        window.location.reload()
                    }}
                />
            </main>
        </div>
    )
}
