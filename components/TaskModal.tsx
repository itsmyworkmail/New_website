'use client'

import { X, Clock, AlignLeft, List, Calendar, Repeat } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskModal({ isOpen, onClose, onAddTask, onReplaceTask }: {
    isOpen: boolean,
    onClose: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAddTask: (task: any) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onReplaceTask: (tempId: string, task: any) => void
}) {
    const supabase = createClient()
    const router = useRouter()

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        // No transition - immediate
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const date = formData.get('date') as string
        const time = formData.get('time') as string
        const isAllDay = formData.get('isAllDay') === 'on'
        const recurrence = formData.get('recurrence') as string
        const listType = formData.get('listType') as string

        const tempId = crypto.randomUUID()
        const optimisticTask = {
            id: tempId,
            title,
            description,
            due_date: date || null,
            due_time: time || null,
            is_all_day: isAllDay,
            recurrence,
            list_type: listType,
            user_id: user.id,
            is_starred: false,
            is_completed: false,
            created_at: new Date().toISOString()
        }

        // 1. Update UI Immediately
        onAddTask(optimisticTask)
        onClose()

        // 2. Perform Server Request
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                title,
                description,
                due_date: date || null,
                due_time: time || null,
                is_all_day: isAllDay,
                recurrence,
                list_type: listType,
                user_id: user.id,
                is_starred: false,
                is_completed: false
            })
            .select()
            .single()

        // 3. Reconcile with Server Data
        if (data && !error) {
            onReplaceTask(tempId, data)
            router.refresh()
        } else {
            console.error("Failed to create task", error)
            // Ideally we should revert the optimistic update here, simple alert for now
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1B1B1B] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
                >
                    <X size={20} />
                </button>

                <form action={handleSubmit} className="p-6 space-y-6">

                    {/* Title Input */}
                    <div>
                        <input
                            name="title"
                            type="text"
                            placeholder="Add title"
                            required
                            autoFocus
                            className="w-full bg-transparent text-2xl font-semibold placeholder:text-gray-500 text-white border-none focus:ring-0 focus:outline-none px-0 py-2 transition-colors"
                        />
                    </div>

                    {/* Date & Time Row */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <Clock className="text-gray-400" size={20} />
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        name="date"
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="bg-[#27272a] text-sm text-white px-3 py-2 rounded-md border border-white/5 focus:border-primary/50 outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        name="time"
                                        type="time"
                                        className="bg-[#27272a] text-sm text-white px-3 py-2 rounded-md border border-white/5 focus:border-primary/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-9">
                            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                                <input name="isAllDay" type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
                                All day
                            </label>
                        </div>

                        <div className="pl-9">
                            <select name="recurrence" className="bg-[#27272a] text-sm text-gray-300 px-3 py-2 rounded-md border border-white/5 focus:border-primary/50 outline-none w-40">
                                <option>Does not repeat</option>
                                <option>Daily</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex gap-4">
                        <AlignLeft className="text-gray-400 mt-1" size={20} />
                        <textarea
                            name="description"
                            placeholder="Add description"
                            rows={3}
                            className="flex-1 bg-[#27272a] text-sm text-white px-3 py-2 rounded-lg border border-white/5 focus:border-primary/50 outline-none resize-none"
                        ></textarea>
                    </div>

                    {/* List Selection */}
                    <div className="flex items-center gap-4">
                        <List className="text-gray-400" size={20} />
                        <select name="listType" className="bg-[#27272a] text-sm text-white px-3 py-2 rounded-md border border-white/5 focus:border-primary/50 outline-none">
                            <option>My Tasks</option>
                            <option>Work</option>
                            <option>Personal</option>
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
