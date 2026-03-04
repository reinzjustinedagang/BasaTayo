import React from 'react';
import { motion } from 'framer-motion';
interface PlayfulButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
export function PlayfulButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: PlayfulButtonProps) {
  const baseStyles =
  'relative font-heading font-bold rounded-3xl transition-all flex items-center justify-center text-white';
  const variants = {
    primary:
    'bg-basa-primary shadow-[0_6px_0_0_#d9534f] active:shadow-[0_0px_0_0_#d9534f]',
    secondary:
    'bg-basa-secondary shadow-[0_6px_0_0_#3baea3] active:shadow-[0_0px_0_0_#3baea3]',
    accent:
    'bg-basa-accent text-basa-text shadow-[0_6px_0_0_#e5cf5c] active:shadow-[0_0px_0_0_#e5cf5c]',
    success:
    'bg-basa-success text-basa-text shadow-[0_6px_0_0_#7ac7ba] active:shadow-[0_0px_0_0_#7ac7ba]'
  };
  const sizes = {
    sm: 'px-4 py-2 text-lg active:translate-y-[4px]',
    md: 'px-6 py-3 text-xl active:translate-y-[6px]',
    lg: 'px-8 py-4 text-2xl active:translate-y-[6px]',
    xl: 'px-10 py-6 text-3xl active:translate-y-[6px] w-full'
  };
  return (
    <motion.button
      whileHover={{
        scale: 1.02
      }}
      whileTap={{
        scale: 0.95
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>

      {children}
    </motion.button>);

}