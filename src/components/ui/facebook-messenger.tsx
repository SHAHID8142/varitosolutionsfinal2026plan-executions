/**
 * @file facebook-messenger.tsx
 * @description Official Facebook Messenger Chat Widget integration.
 *              Optimized for mobile users in Bangladesh.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"

declare global {
  interface Window {
    fbAsyncInit: () => void
    FB: {
      init: (params: { xfbml: boolean; version: string }) => void
    }
  }
}

export function FacebookMessenger() {
  React.useEffect(() => {
    // Create the script element
    const script = document.createElement("script")
    script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"
    script.async = true
    script.defer = true
    
    // Set up the global fbAsyncInit function
    window.fbAsyncInit = function() {
      window.FB.init({
        xfbml: true,
        version: 'v18.0'
      });
    };

    document.body.appendChild(script)

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <div id="fb-root"></div>
      <div 
        id="fb-customer-chat" 
        className="fb-customerchat"
        {...(Object.assign({}, {
          attribution: "biz_inbox",
          page_id: "YOUR_FACEBOOK_PAGE_ID",
          theme_color: "#10b981",
          logged_in_greeting: "How can we help you with your premium home upgrades?",
          logged_out_greeting: "Hi! Chat with us about luxury sanitary & packaging items."
        }))}
      ></div>
    </>
  )
}
