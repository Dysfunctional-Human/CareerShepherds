import React from "react"
import { cn } from "@/lib/utils"


const ProgressBar = ({ percentage, className }) => {
  return (
    <div className={cn("w-full mb-4", className)}>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Your profile is {percentage}% complete</p>
    </div>
  )
}

export default ProgressBar

