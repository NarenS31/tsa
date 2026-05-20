'use client';
import { SubmissionStatus } from '@/lib/types';

const CONFIG: Record<SubmissionStatus, { label: string; className: string }> = {
  pending:        { label: 'Pending',        className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  reviewed:       { label: 'Reviewed',       className: 'bg-green-50 text-green-700 border border-green-200' },
  needs_revision: { label: 'Needs Revision', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
  missing:        { label: 'Missing',        className: 'bg-red-50 text-red-600 border border-red-200' },
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
