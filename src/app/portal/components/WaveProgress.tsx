export default function WaveProgress({
  percent,
  size = 44,
  showLabel = false,
  bg = 'var(--portal-navy-050)',
  stroke = 'var(--portal-slate-200)',
  fill = 'var(--portal-turq)',
  labelColor = 'var(--portal-navy)',
}: {
  percent: number;
  size?: number;
  showLabel?: boolean;
  bg?: string;
  stroke?: string;
  fill?: string;
  labelColor?: string;
}) {
  const p = Math.max(0, Math.min(100, percent));
  const fillY = 100 - p;
  const clipId = `portal-wave-clip-${Math.round(p)}-${size}`;

  return (
    <svg
      className="portal-wave-anim"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${p}% complete`}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" fill={bg} stroke={stroke} strokeWidth="2" />
      <g clipPath={`url(#${clipId})`}>
        <path fill={fill} opacity="0.95">
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values={`
              M-10,${fillY} Q 15,${fillY - 6} 40,${fillY} T 90,${fillY} T 140,${fillY} V120 H-10 Z;
              M-10,${fillY} Q 15,${fillY + 6} 40,${fillY} T 90,${fillY} T 140,${fillY} V120 H-10 Z;
              M-10,${fillY} Q 15,${fillY - 6} 40,${fillY} T 90,${fillY} T 140,${fillY} V120 H-10 Z
            `}
          />
        </path>
      </g>
      <circle cx="50" cy="50" r="47" fill="none" stroke={stroke} strokeWidth="2" />
      {showLabel && (
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
          fontSize="22"
          fill={labelColor}
        >
          {p}%
        </text>
      )}
    </svg>
  );
}
