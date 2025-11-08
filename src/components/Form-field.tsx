"use client"

import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
    label: string
    required?: boolean
    error?: string
    children: ReactNode
    className?: string
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {error}
                </p>
            )}
        </div>
    )
}
