'use client'

import { ReactNode } from 'react'

interface TooltipProps {
    children: ReactNode
    text: string
    position?: 'right' | 'bottom'
}

export default function Tooltip({ children, text, position = 'right' }: TooltipProps) {
    return (
        <div className="group relative flex items-center">
            {children}
            <div className={`
                absolute opacity-0 scale-95 pointer-events-none
                group-hover:opacity-100 group-hover:scale-100
                transition-all duration-200 ease-out z-50
                bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap
                ${position === 'right' ? 'left-full ml-2' : ''}
                ${position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
            `}>
                {text}
            </div>
        </div>
    )
}
