'use client'

import { Star, Trash2, Calendar, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
    id: string
    title: string
    description?: string | null
    is_starred: boolean
    is_completed: boolean
    due_date?: string | null
    list_type?: string
}

interface TaskProps {
    task: Task
}

export default function TaskCard({ task }: TaskProps) {
    const [isPending, startTransition] = useTransition()
    const supabase = createClient()
    const router = useRouter()

    const handleStar = (e: React.MouseEvent) => {
        e.stopPropagation()
        startTransition(async () => {
            await supabase
                .from('tasks')
                .update({ is_starred: !task.is_starred })
                .eq('id', task.id)
            router.refresh()
        })
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this task?')) {
            startTransition(async () => {
                await supabase
                    .from('tasks')
                    .delete()
                    .eq('id', task.id)
                router.refresh()
            })
        }
    }

    const handleToggleComplete = () => {
        // Optimistic UI could be improved here, but useTransition handles the loading state
        startTransition(async () => {
            await supabase
                .from('tasks')
                .update({ is_completed: !task.is_completed })
                .eq('id', task.id)
            router.refresh()
        })
    }

    return (
        <div className="group bg-card hover:bg-muted/50 border border-border/40 p-4 rounded-xl flex flex-col gap-3 transition-all duration-300 h-full shadow-sm hover:shadow-md hover:border-border/80">
            {/* Header: Checkbox & Title */}
            <div className="flex items-start gap-3">
                <button
                    onClick={handleToggleComplete}
                    disabled={isPending}
                    className={`
                        w-5 h-5 min-w-[1.25rem] mt-0.5 rounded border flex items-center justify-center transition-all duration-200
                        ${task.is_completed
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground hover:border-primary'
                        }
                    `}
                >
                    {task.is_completed && <Check size={12} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-foreground truncate transition-all ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </h3>
                </div>
            </div>

            {/* Description (Optional) */}
            {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                    {task.description}
                </p>
            )}

            {/* Tags & Dates */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground mt-auto pt-2">
                {task.due_date && (
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{task.due_date}</span>
                    </div>
                )}
                <div className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                    {task.list_type}
                </div>
            </div>

            {/* Footer Actions (Bottom) */}
            <div className="flex items-center justify-end gap-1 pt-3 mt-2 border-t border-border/30">
                <button
                    onClick={handleStar}
                    className={`p-1.5 rounded-md hover:bg-muted transition-colors ${task.is_starred ? 'text-yellow-400' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Star Task"
                >
                    <Star size={16} fill={task.is_starred ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                    title="Delete Task"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
