import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
    children?: React.ReactNode;
    className?: string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "bg-[#10b981] text-white": variant === "default" || variant === "success",
                    "bg-[#27272a] text-[#f4f4f5] hover:bg-[#3f3f46]": variant === "secondary",
                    "bg-red-500/10 text-red-500 hover:bg-red-500/20": variant === "destructive",
                    "text-[#f4f4f5] border-[#27272a]": variant === "outline",
                    "bg-yellow-500/10 text-yellow-500": variant === "warning",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
