'use client';

import { useState } from 'react';

interface KakaoCTAProps {
  label: string;
  id: string;
}

export default function KakaoCTA({ label, id }: KakaoCTAProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — graceful no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`KakaoTalk ID: ${id}. Click to copy.`}
      className="flex items-center justify-center gap-3 bg-[#FAE100] text-[#3A1D1D] px-6 py-4 rounded-xl font-semibold shadow-md hover:brightness-95 active:scale-[0.98] transition-all w-full cursor-pointer"
    >
      <span className="w-7 h-7 bg-[#3A1D1D] rounded-full flex items-center justify-center text-[#FAE100] font-black text-xs flex-shrink-0">
        K
      </span>
      <span className="font-body">{copied ? `Copied: ${id}` : label}</span>
    </button>
  );
}
