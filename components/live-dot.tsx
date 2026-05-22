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
  const pingColor =
    variant === 'broadcast' ? 'bg-[#00a6f0]' :
    variant === 'inactive'  ? '' :
    'bg-red-400';
  const glow =
    variant === 'broadcast' ? 'shadow-[0_0_8px_rgba(0,166,240,0.8)]' :
    variant === 'inactive'  ? '' :
    'shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  const dotSize = size === 'sm' ? 'size-1.5' : 'size-2';
  const active = variant !== 'inactive';

  return (
    <span className={`relative flex shrink-0 ${dotSize}${className ? ` ${className}` : ''}`}>
      {active && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingColor}`} />
      )}
      <span className={`relative inline-flex h-full w-full rounded-full ${color} ${glow}`} />
    </span>
  );
}
