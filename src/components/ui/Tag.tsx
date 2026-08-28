import React from 'react';

type TagTone = 'neutral' | 'blue' | 'purple' | 'cyan' | 'green' | 'orange' | 'pink';

const toneClasses: Record<TagTone, string> = {
  neutral: 'bg-[#f3f4f8] text-[#5d6170]',
  blue: 'bg-[#edf0ff] text-[#4f5de8]',
  purple: 'bg-[#f2edff] text-[#7c4ee7]',
  cyan: 'bg-[#e8fbff] text-[#087f99]',
  green: 'bg-[#eafbf4] text-[#168460]',
  orange: 'bg-[#fff3e8] text-[#c76016]',
  pink: 'bg-[#fff0f7] text-[#c84f8c]',
};

export default function Tag({ children, accent = false, tone }: { children: React.ReactNode; accent?: boolean; tone?: TagTone }) {
  const resolvedTone = tone ?? (accent ? 'blue' : 'neutral');
  return (
    <span className={`inline-flex min-h-7 items-center rounded-lg px-2.5 text-xs font-semibold ${toneClasses[resolvedTone]}`}>
      {children}
    </span>
  );
}
