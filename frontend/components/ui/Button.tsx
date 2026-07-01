import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  fullWidth?: boolean
  as?: 'button' | 'span'
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-brutal btn-primary',
  accent:  'btn-brutal btn-accent',
  ghost:   'btn-brutal btn-ghost',
  danger:  'btn-brutal btn-danger',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'text-[11px] py-2 px-4',
  md: 'text-[13px] py-3 px-6',
  lg: 'text-[15px] py-4 px-8',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full justify-center',
        'cursor-crosshair',
        className
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight size={14} strokeWidth={2} />}
    </button>
  )
}
