'use client'

import { Plus, CheckSquare, Star, CheckCheck } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'

export default function Sidebar({ onAddTask, currentFilter, setFilter }: {
    onAddTask: () => void,
    currentFilter?: 'all' | 'starred' | 'completed',
    setFilter?: (filter: 'all' | 'starred' | 'completed') => void
}) {
    // Permanent collapsed state logic: simply remove the state and hardcode 'w-20' style

    return (
        <aside
            className="h-screen w-20 bg-card border-r border-border/50 flex flex-col z-30 transition-all duration-300"
        >
            {/* Sidebar Header - Empty now or Logo */}
            <div className="h-16 flex items-center justify-center">
                {/* Optional: App Logo or Icon could go here */}
            </div>

            <div className="flex-1 px-4 py-6 space-y-8 flex flex-col items-center">
                {/* Add Task Button */}
                <Tooltip text="Add Task">
                    <button
                        onClick={onAddTask}
                        className="h-12 w-12 bg-primary hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300"
                    >
                        <Plus size={24} />
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
            </div>
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
