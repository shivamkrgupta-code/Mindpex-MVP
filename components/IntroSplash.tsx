'use client'

import { useEffect, useState } from 'react'

interface IntroSplashProps {
  onComplete: () => void
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Skip animation entirely
      onComplete()
      return
    }

    // Fade in
    setTimeout(() => setIsVisible(true), 50)

    // Hold, then fade out and complete
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 300) // Wait for fade out
    }, 1200) // 300ms fade in + 700ms hold + 200ms buffer

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#000000] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backdropFilter: 'blur(0px)' }}
    >
      {/* Logo/Wordmark */}
      <div
        className={`transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Mindpex Wordmark */}
        <div className="relative">
          {/* Main wordmark */}
          <div className="relative">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
              Mindpex
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
