'use client';
import { EventCategory } from '@/lib/types';

const CONFIG: Record<EventCategory, { label: string; className: string }> = {
  product:      { label: 'Product',      className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  presentation: { label: 'Presentation', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
  testing:      { label: 'Testing',      className: 'bg-teal-50 text-teal-700 border border-teal-200' },
};

export default function CategoryBadge({ category }: { category: EventCategory }) {
  const { label, className } = CONFIG[category];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
