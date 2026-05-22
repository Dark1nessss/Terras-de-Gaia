interface LiveDotProps {
  /** 'live' = red (default), 'broadcast' = blue, 'inactive' = gray static */
  variant?: 'live' | 'broadcast' | 'inactive';
  /** 'md' = size-2 (default), 'sm' = size-1.5 */
  size?: 'md' | 'sm';
  className?: string;
}

export function LiveDot({ variant = 'live', size = 'md', className }: LiveDotProps) {
  const color =
    variant === 'broadcast' ? 'bg-[#00a6f0]' :
    variant === 'inactive'  ? 'bg-white/20' :
    'bg-red-500';
  const pulse = variant !== 'inactive' ? ' animate-pulse' : '';
  const dotSize = size === 'sm' ? 'size-1.5' : 'size-2';
  return (
    <span
      className={`inline-block rounded-full shrink-0 ${dotSize} ${color}${pulse}${className ? ` ${className}` : ''}`}
    />
  );
}
