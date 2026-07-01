'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface TextRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'span'
}

export default function TextReveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: TextRevealProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
