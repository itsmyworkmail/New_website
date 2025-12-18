import { Star, Trash2, Calendar, Check, Clock, Repeat, Save } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Task {
    id: string
    title: string
    description?: string | null
    is_starred: boolean
    is_completed: boolean
    due_date?: string | null
    due_time?: string | null
    recurrence?: string | null
    list_type?: string
}

interface TaskProps {
    task: Task
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdateTask?: (task: any) => void
    onDeleteTask?: (taskId: string) => void
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask }: TaskProps) {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    // Edit State
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescription] = useState(task.description || '')
    const [editDate, setEditDate] = useState(task.due_date || '')
    const [editTime, setEditTime] = useState(task.due_time || '')
    const [editRecurrence, setEditRecurrence] = useState(task.recurrence || 'Does not repeat')
    const [editListType, setEditListType] = useState(task.list_type || 'My Tasks')

    const handleStar = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Optimistic update
        const updatedTask = { ...task, is_starred: !task.is_starred }
        onUpdateTask?.(updatedTask)

        startTransition(async () => {
            await supabase
                .from('tasks')
                .update({ is_starred: updatedTask.is_starred })
                .eq('id', task.id)
            router.refresh()
        })
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this task?')) {
            // Optimistic update
            onDeleteTask?.(task.id)

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
        // Optimistic update
        const updatedTask = { ...task, is_completed: !task.is_completed }
        onUpdateTask?.(updatedTask)

        startTransition(async () => {
            await supabase
                .from('tasks')
                .update({ is_completed: updatedTask.is_completed })
                .eq('id', task.id)
            router.refresh()
        })
    }

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const updatedData = {
            title: editTitle,
            description: editDescription,
            due_date: editDate || null,
            due_time: editTime || null,
            recurrence: editRecurrence,
            list_type: editListType
        }

        // Optimistic UI Update locally
        onUpdateTask?.({ ...task, ...updatedData })
        setIsEditing(false)

        startTransition(async () => {
            await supabase
                .from('tasks')
                .update(updatedData)
                .eq('id', task.id)
            router.refresh()
        })
    }

    if (isEditing) {
        return (
            <div className="group bg-card border border-primary/50 p-3 rounded-lg flex flex-col gap-3 transition-all duration-300 h-auto shadow-md relative z-10">
                {/* Edit Title */}
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-foreground border-b border-white/10 focus:border-primary/50 outline-none pb-1"
                    placeholder="Task title"
                    autoFocus
                />

                {/* Edit Description */}
                <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-transparent text-xs text-muted-foreground border-none outline-none resize-none"
                    placeholder="Add description..."
                    rows={2}
                />

                {/* Meta Controls Row */}
                <div className="flex items-center gap-3 mt-1">
                    {/* Date */}
                    <div className="relative group">
                        <Calendar size={14} className="text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                        <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
                        />
                    </div>
                    {/* Time */}
                    <div className="relative group">
                        <Clock size={14} className="text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                        <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6"
                        />
                    </div>
                    {/* Recurrence */}
                    <div className="relative group">
                        <Repeat size={14} className="text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                        <select
                            value={editRecurrence}
                            onChange={(e) => setEditRecurrence(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-6 h-6 appearance-none"
                        >
                            <option value="Does not repeat">No Repeat</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    {/* List Selector */}
                    <select
                        value={editListType}
                        onChange={(e) => setEditListType(e.target.value)}
                        className="bg-transparent text-[10px] text-muted-foreground border border-white/10 rounded px-1 py-0.5 outline-none focus:border-primary/50"
                    >
                        <option>My Tasks</option>
                        <option>Work</option>
                        <option>Personal</option>
                    </select>

                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center gap-1 bg-primary text-white text-[10px] px-2 py-1 rounded hover:opacity-90 transition-opacity"
                    >
                        <Save size={12} />
                        Save
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={handleStar}
                        className={`${task.is_starred ? 'text-yellow-400' : 'text-muted-foreground hover:text-foreground'}`}
                        title="Star Task"
                    >
                        <Star size={14} fill={task.is_starred ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="group bg-card hover:bg-muted/50 border border-border/40 p-3 rounded-lg flex flex-col gap-2 transition-all duration-300 h-full shadow-sm hover:shadow-md hover:border-border/80 cursor-pointer"
        >
            {/* Header: Checkbox & Title */}
            <div className="flex items-start gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleToggleComplete()
                    }}
                    disabled={isPending}
                    className={`
                        w-4 h-4 min-w-[1rem] mt-1 rounded border flex items-center justify-center transition-all duration-200
                        ${task.is_completed
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground hover:border-primary'
                        }
                    `}
                >
                    {task.is_completed && <Check size={10} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium text-foreground truncate transition-all ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </h3>
                </div>
            </div>

            {/* Description (Optional) */}
            {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                    {task.description}
                </p>
            )}

            {/* Tags & Dates */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground mt-auto pt-1">
                {task.due_date && (
                    <div className="flex items-center gap-0.5">
                        <Calendar size={10} />
                        <span>{task.due_date}</span>
                    </div>
                )}
                <div className="px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                    {task.list_type}
                </div>
            </div>

            {/* Footer Actions (Bottom) */}
            <div className="flex items-center justify-end gap-1 pt-2 mt-1 border-t border-border/30">
                <button
                    onClick={handleStar}
                    className={`p-1 rounded-md hover:bg-muted transition-colors ${task.is_starred ? 'text-yellow-400' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Star Task"
                >
                    <Star size={14} fill={task.is_starred ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                    title="Delete Task"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}
