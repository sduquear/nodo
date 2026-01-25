'use client';

import { ExternalLink } from 'lucide-react';

interface ViewPageButtonProps {
  username: string;
}

export function ViewPageButton({ username }: ViewPageButtonProps) {
  const handleClick = () => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/${username}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-[#FFDD00] text-black rounded-full text-sm font-semibold hover:bg-[#f5d400] transition-colors cursor-pointer flex items-center gap-2"
    >
      Ver mi página
      <ExternalLink size={18} />
    </button>
  );
}
