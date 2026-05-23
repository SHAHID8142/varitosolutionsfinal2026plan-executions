/**
 * @file pwa-install-prompt.tsx
 * @description Subtle banner prompting users to install the Varito PWA.
 *              Uses beforeinstallprompt event to detect support.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { Smartphone, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Update UI notify the user they can install the PWA
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    // outcome is 'accepted' or 'dismissed' — no logging needed
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-20 left-4 right-4 z-[90] md:left-auto md:right-8 md:bottom-8 md:w-96",
      "animate-in fade-in slide-in-from-bottom-8 duration-500"
    )}>
      <div className="bg-gray-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 size-24 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        
        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Smartphone className="size-6 text-white" />
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <h4 className="text-sm font-black uppercase tracking-tight">Install Varito App</h4>
          <p className="text-xs text-gray-400 font-medium">Faster access & offline support.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleInstall}
            size="sm" 
            className="h-10 rounded-xl px-4 font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90"
          >
            <Download className="mr-1.5 size-3" /> Install
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="size-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
