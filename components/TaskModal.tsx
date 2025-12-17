'use client'

import { X, Clock, AlignLeft, List } from 'lucide-react'
import { createTask } from '@/app/actions/tasks'
import { useTransition } from 'react'

export default function TaskModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [isPending, startTransition] = useTransition()

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await createTask(formData)
            onClose()
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1E1E24] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden">
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
                            className="w-full bg-transparent text-2xl font-semibold placeholder:text-gray-500 text-white border-0 border-b border-white/10 focus:border-white/30 focus:ring-0 px-0 py-2 transition-colors"
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
                            disabled={isPending}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
