import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'volt' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase transition-colors';

  const variants = {
    default:
      'border border-[#ccff00]/40 bg-[#ccff00]/10 text-[#ccff00]',
    volt:
      'border border-[#ccff00]/50 bg-[#ccff00]/15 text-[#ccff00]',
    secondary:
      'border border-[#232b3d] bg-[#121724] text-zinc-300',
    destructive:
      'border border-red-500/30 bg-red-500/10 text-red-400',
    success:
      'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    warning:
      'border border-amber-500/30 bg-amber-500/10 text-amber-400',
    outline:
      'border border-[#262c3e] text-zinc-400'
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  );
}

export { Badge };
