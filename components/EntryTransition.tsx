'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EntryTransitionProps {
  onComplete?: () => void
}

export default function EntryTransition({ onComplete }: EntryTransitionProps = {}) {
  const [stage, setStage] = useState<'hidden' | 'message1' | 'message2' | 'exit' | 'complete'>('hidden')

  useEffect(() => {
    // Check if user has already seen the intro this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')

    if (hasSeenIntro === 'true') {
      setStage('complete')
      if (onComplete) {
        onComplete()
      }
      return
    }

    // Animation sequence
    const timer1 = setTimeout(() => {
      setStage('message1') // Show first message
    }, 100)

    const timer2 = setTimeout(() => {
      setStage('message2') // Show second message
    }, 1200) // 300ms fade in + 700ms hold + 200ms transition

    const timer3 = setTimeout(() => {
      setStage('exit') // Move text up, fade in dashboard
    }, 2600) // Previous + 700ms hold + 700ms pause

    const timer4 = setTimeout(() => {
      setStage('complete') // Remove overlay completely
      sessionStorage.setItem('hasSeenIntro', 'true')
      if (onComplete) {
        onComplete()
      }
    }, 3300) // Previous + 700ms exit animation

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  if (stage === 'complete') {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === 'exit' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <div className="relative w-full max-w-4xl px-6">
          <AnimatePresence mode="wait">
            {stage === 'message1' && (
              <motion.div
                key="message1"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                  Understanding workforce risk.
                </h1>
              </motion.div>
            )}

            {stage === 'message2' && (
              <motion.div
                key="message2"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                  opacity: { duration: 0.4, ease: 'easeInOut' },
                  y: { duration: 0.4, ease: 'easeInOut' }
                }}
              >
                <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                  Before it becomes bad attrition.
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
