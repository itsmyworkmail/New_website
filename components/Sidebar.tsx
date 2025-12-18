'use client'

import { Plus, CheckSquare, Star, CheckCheck, User } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import Image from 'next/image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Sidebar({ onAddTask, currentFilter, setFilter, user }: {
    onAddTask: () => void,
    currentFilter?: 'all' | 'starred' | 'completed',
    setFilter?: (filter: 'all' | 'starred' | 'completed') => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any
}) {
    // Permanent collapsed state logic: simply remove the state and hardcode 'w-20' style
    const avatarUrl = user?.user_metadata?.avatar_url
    const displayName = user?.user_metadata?.full_name || user?.email || 'User Name'

    return (
        <aside
            className="sticky top-0 h-screen w-20 bg-card flex flex-col z-30 transition-all duration-300 items-center py-6 gap-6 self-start"
        >
            {/* Profile Picture */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={displayName}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                        <User size={20} />
                    </div>
                )}
            </div>

            {/* Add Task Button */}
            <Tooltip text="Add Task">
                <button
                    onClick={onAddTask}
                    className="h-10 w-10 bg-primary hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300"
                >
                    <Plus size={22} />
                </button>
            </Tooltip>

            {/* Navigation */}
            <nav className="space-y-4 w-full flex flex-col items-center">
                <Tooltip text="All Tasks">
                    <div onClick={() => setFilter?.('all')} className="w-full">
                        <NavItem
                            icon={<CheckSquare size={20} />}
                            isActive={currentFilter === 'all'}
                        />
                    </div>
                </Tooltip>

                <Tooltip text="Starred">
                    <div onClick={() => setFilter?.('starred')} className="w-full">
                        <NavItem
                            icon={<Star size={20} />}
                            isActive={currentFilter === 'starred'}
                        />
                    </div>
                </Tooltip>

                <Tooltip text="Completed">
                    <div onClick={() => setFilter?.('completed')} className="w-full">
                        <NavItem
                            icon={<CheckCheck size={20} />}
                            isActive={currentFilter === 'completed'}
                        />
                    </div>
                </Tooltip>
            </nav>
        </aside>
    )
}

function NavItem({ icon, isActive }: { icon: React.ReactNode, isActive?: boolean }) {
    return (
        <button
            className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200
                ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
        >
            {icon}
        </button>
    )
}
