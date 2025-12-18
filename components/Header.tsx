'use client'

import { Moon, Sun, Bell, Settings, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import Tooltip from '@/components/ui/Tooltip'
import { createClient } from '@/utils/supabase/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ user, filter }: { user?: any, filter: string }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const title = filter === 'all' ? 'My Tasks' : filter === 'starred' ? 'Starred Tasks' : 'Completed Tasks'

    return (
        <header className="h-16 w-full flex items-center justify-between px-6 bg-transparent sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold capitalize tracking-tight text-foreground">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                <Tooltip text={mounted && theme === 'dark' ? 'Light mode' : 'Dark mode'} position="bottom">
                    <button
                        onClick={toggleTheme}
                        className="icon-btn text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-105"
                    >
                        {mounted && theme === 'dark' ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} />}
                    </button>
                </Tooltip>
                <button className="icon-btn text-muted-foreground hover:text-foreground">
                    <Bell size={22} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="icon-btn text-muted-foreground hover:text-foreground"
                    >
                        <Settings size={22} />
                    </button>

                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-2 bg-card border border-border ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border/50 mb-1 uppercase tracking-wider">
                                Settings
                            </div>
                            <button
                                onClick={async () => {
                                    await createClient().auth.signOut()
                                    window.location.href = '/login'
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
                            >
                                <LogOut size={16} />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
