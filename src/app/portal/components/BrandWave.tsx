export default function BrandWave({
  size = 36,
  color1 = 'var(--portal-navy)',
  color2 = 'var(--portal-turq)',
}: {
  size?: number;
  color1?: string;
  color2?: string;
}) {
  return (
    <svg width={size} height={size * (18 / 26)} viewBox="0 0 26 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,13 Q6.5,4 13,13 T26,13" stroke={color1} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M0,8 Q6.5,-1 13,8 T26,8" stroke={color2} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
