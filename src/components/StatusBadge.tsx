'use client';
import { SubmissionStatus } from '@/lib/types';

const CONFIG: Record<SubmissionStatus, { label: string; icon: string; className: string }> = {
  pending:        { label: 'Pending',        icon: '⏳', className: 'bg-amber-100/90 text-amber-800 ring-1 ring-amber-200' },
  reviewed:       { label: 'Reviewed',       icon: '✓', className: 'bg-emerald-100/90 text-emerald-800 ring-1 ring-emerald-200' },
  needs_revision: { label: 'Needs Revision', icon: '!', className: 'bg-orange-100/90 text-orange-800 ring-1 ring-orange-200' },
  missing:        { label: 'Missing',        icon: '×', className: 'bg-rose-100/90 text-rose-800 ring-1 ring-rose-200' },
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, icon, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] ${className}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
}
