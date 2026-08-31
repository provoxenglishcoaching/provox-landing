import Image from 'next/image';
import { avatarSrc, isValidAvatar } from '../lib/avatars';

/** Neutral head-and-shoulders, shown until an icon has been chosen. */
function Placeholder({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      style={{ display: 'block', borderRadius: '50%', background: '#e6e8f2' }}
    >
      <circle cx="20" cy="15.5" r="6.2" fill="#b9c0d4" />
      <path d="M8.5 33c1.6-6 6-9 11.5-9s9.9 3 11.5 9z" fill="#b9c0d4" />
    </svg>
  );
}

export default function Avatar({
  avatar,
  name,
  size = 40,
}: {
  avatar: string;
  name: string;
  size?: number;
}) {
  if (!avatar || !isValidAvatar(avatar)) {
    return (
      <span style={{ flex: 'none', lineHeight: 0 }} title={name}>
        <Placeholder size={size} />
      </span>
    );
  }

  return (
    <Image
      src={avatarSrc(avatar)}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', borderRadius: '50%', flex: 'none', background: '#e6e8f2' }}
    />
  );
}
