import React from 'react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export default function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? <p className="mb-4 text-sm font-bold tracking-[0.08em] text-primary">{eyebrow}</p> : null}
      <h2 className="zy-page-title text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]">{title}</h2>
      {description ? <p className="mt-5 text-base leading-7 text-[#606060] sm:text-lg sm:leading-8">{description}</p> : null}
    </div>
  );
}
