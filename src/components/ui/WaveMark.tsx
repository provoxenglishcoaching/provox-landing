/**
 * The ProVox wave mark on its own — no "PROVOX" wordmark, no tagline.
 * Redrawn from the official logo so it stays sharp at any size and can be
 * recoloured for dark backgrounds.
 *
 * variant="brand" — the teal tints from the official lockup (use on navy or white)
 * variant="mono"  — inherits currentColor at three opacities (use for a flat white mark)
 */
export default function WaveMark({
  variant = 'brand',
  className,
  title = 'ProVox',
}: {
  variant?: 'brand' | 'mono';
  className?: string;
  title?: string;
}) {
  const bars = [
    { x: 0, h: 172 },
    { x: 110, h: 306 },
    { x: 220, h: 450 },
    { x: 330, h: 306 },
    { x: 440, h: 172 },
  ];

  // Outer bars lightest, centre bar strongest — matches the official mark.
  const tone = (i: number) => {
    const step = i === 2 ? 2 : i === 1 || i === 3 ? 1 : 0;
    if (variant === 'mono') {
      return { fill: 'currentColor', opacity: [0.45, 0.7, 1][step] };
    }
    return { fill: ['#b8e8e7', '#62ccc9', '#1fb5b3'][step], opacity: 1 };
  };

  return (
    <svg
      viewBox="0 0 500 460"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars.map((bar, i) => {
        const { fill, opacity } = tone(i);
        return (
          <rect
            key={bar.x}
            x={bar.x}
            y={230 - bar.h / 2}
            width={60}
            height={bar.h}
            rx={30}
            fill={fill}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
