import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'volt';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060709] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      default:
        'bg-[#ccff00] text-black shadow-sm hover:bg-[#b8e600] shadow-[0_2px_10px_rgba(204,255,0,0.2)]',
      volt:
        'bg-[#ccff00] text-black shadow-sm hover:bg-[#b8e600] shadow-[0_2px_12px_rgba(204,255,0,0.25)]',
      destructive:
        'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
      outline:
        'border border-[#262c3e] bg-transparent text-zinc-200 hover:bg-[#121622] hover:text-white hover:border-[#373f55]',
      secondary:
        'bg-[#121724] text-zinc-100 border border-[#232b3d] hover:bg-[#192132] hover:border-zinc-500 hover:text-white',
      ghost:
        'text-zinc-400 hover:bg-[#121622] hover:text-zinc-100',
      link:
        'text-[#ccff00] underline-offset-4 hover:underline p-0 h-auto'
    };

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-lg px-3 text-[11px]',
      lg: 'h-11 rounded-xl px-6 text-sm',
      icon: 'h-9 w-9 p-0'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
