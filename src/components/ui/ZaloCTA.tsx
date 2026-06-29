interface ZaloCTAProps {
  label: string;
}

export default function ZaloCTA({ label }: ZaloCTAProps) {
  return (
    <a
      href="https://zalo.me/0965869015"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 bg-[#0068FF] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#0055d4] transition-colors shadow-md"
    >
      {/* Zalo Z icon */}
      <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#0068FF] font-black text-sm flex-shrink-0">
        Z
      </span>
      <span className="font-body">{label}</span>
    </a>
  );
}
