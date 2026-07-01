'use client'

import { motion } from 'framer-motion'

interface CharRevealProps {
  text: string
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

export default function CharReveal({
  text,
  className = '',
  staggerDelay = 0.03,
  initialDelay = 0,
}: CharRevealProps) {
  const chars = text.split('')

  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: initialDelay + i * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
