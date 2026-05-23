/**
 * @file flash-deal-countdown.tsx
 * @description A visual countdown timer for Flash Deals.
 *              Used in the admin preview and homepage deal section.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FlashDealCountdownProps {
  targetDate: string | Date
  className?: string
  onExpire?: () => void
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-gray-900 text-white min-w-10 h-10 flex items-center justify-center rounded-lg text-lg font-black font-mono">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
  )
}

export function FlashDealCountdown({ targetDate, className, onExpire }: FlashDealCountdownProps) {
  const calculateTimeLeft = React.useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime()
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    }
  }, [targetDate])

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft)

  React.useEffect(() => {
    if (timeLeft.isExpired && onExpire) {
      onExpire()
      return
    }

    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft()
      setTimeLeft(updatedTime)
      if (updatedTime.isExpired) {
        if (onExpire) onExpire()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft, onExpire, timeLeft.isExpired])

  if (timeLeft.isExpired) {
    return (
      <div className={cn("text-red-500 font-bold uppercase tracking-widest text-xs", className)}>
        Deal Expired
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TimeBlock value={timeLeft.days} label="Days" />
      <span className="text-gray-300 font-bold mb-5">:</span>
      <TimeBlock value={timeLeft.hours} label="Hrs" />
      <span className="text-gray-300 font-bold mb-5">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-gray-300 font-bold mb-5">:</span>
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  )
}
