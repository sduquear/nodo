'use client';

import { useState } from 'react';

interface CopyButtonProps {
  username: string;
}

export function CopyButton({ username }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/${username}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-[#F7F7F7] text-[#6B7280] rounded-full text-sm font-semibold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
    >
      {copied ? '¡Copiado!' : 'Copiar link'}
    </button>
  );
}
