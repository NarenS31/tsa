'use client';
import { EventCategory } from '@/lib/types';

const CONFIG: Record<EventCategory, { label: string; className: string }> = {
  product:      { label: 'Product',      className: 'bg-sky-100/90 text-sky-800 ring-1 ring-sky-200' },
  presentation: { label: 'Presentation', className: 'bg-violet-100/90 text-violet-800 ring-1 ring-violet-200' },
  testing:      { label: 'Testing',      className: 'bg-teal-100/90 text-teal-800 ring-1 ring-teal-200' },
};

export default function CategoryBadge({ category }: { category: EventCategory }) {
  const { label, className } = CONFIG[category];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] ${className}`}>
      {label}
    </span>
  );
}
