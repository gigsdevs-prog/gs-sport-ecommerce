// ============================================
// GS SPORT - Section Heading Component
// ============================================

'use client';

import ScrollReveal from './ScrollReveal';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  return (
    <ScrollReveal className={`mb-10 lg:mb-14 ${align === 'center' ? 'text-center' : ''} ${className}`}>
      <h2 className="text-2xl lg:text-4xl font-light tracking-wide text-neutral-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm text-neutral-500 tracking-wide max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
