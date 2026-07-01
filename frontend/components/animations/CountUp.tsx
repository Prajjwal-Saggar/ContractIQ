'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useMotionValue, useSpring, motion } from 'framer-motion'

interface CountUpProps {
  target: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export default function CountUp({
  target,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: CountUpProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const motionValue   = useMotionValue(0)
  const spring        = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const displayRef    = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (inView) {
      motionValue.set(target)
    }
  }, [inView, motionValue, target])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (displayRef.current) {
        const formatted =
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.round(latest).toLocaleString()
        displayRef.current.textContent = `${prefix}${formatted}${suffix}`
      }
    })
  }, [spring, prefix, suffix, decimals])

  return (
    <motion.span ref={ref} className={className}>
      <span ref={displayRef}>{prefix}0{suffix}</span>
    </motion.span>
  )
}
