'use client';

import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { ChevronRight, TrendingUp } from 'lucide-react';

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function OfficerDashboard() {
  const { submissions, students } = useApp();

  const total = submissions.length;
  const reviewed = submissions.filter(s => s.status === 'reviewed').length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const needsRevision = submissions.filter(s => s.status === 'needs_revision').length;
  const studentsWithSubs = new Set(submissions.map(s => s.studentId));
  const missing = students.filter(s => !studentsWithSubs.has(s.id)).length;
  const recent = [...submissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 6);

  const byCategory = {
    product:      submissions.filter(s => s.eventCategory === 'product').length,
    presentation: submissions.filter(s => s.eventCategory === 'presentation').length,
    testing:      submissions.filter(s => s.eventCategory === 'testing').length,
  };
  const reviewRate = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  const statCards = [
    { label: 'Total Submissions', value: total,         color: 'text-gray-900',   accent: 'border-l-gray-300' },
    { label: 'Reviewed',          value: reviewed,      color: 'text-green-700',  accent: 'border-l-green-500' },
    { label: 'Pending Review',    value: pending,       color: 'text-amber-600',  accent: 'border-l-amber-400' },
    { label: 'Needs Revision',    value: needsRevision, color: 'text-orange-700', accent: 'border-l-orange-500' },
    { label: 'Missing',           value: missing,       color: 'text-red-600',    accent: 'border-l-red-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Officer Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Overview of all TSA club submissions and member activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {statCards.map(card => (
          <div key={card.label} className={`bg-white rounded-xl px-5 py-4 border-l-[3px] ${card.accent}`}>
            <span className="block text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#999' }}>
              {card.label}
            </span>
            <p className={`text-4xl font-bold leading-none ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#EEECE8] rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEE9]">
            <h2 className="text-sm font-bold text-gray-900">Recent Submissions</h2>
            <Link href="/officer/submissions" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            {recent.map(sub => {
              const accentColor =
                sub.eventCategory === 'product' ? '#93C5FD' :
                sub.eventCategory === 'presentation' ? '#C4B5FD' : '#5EEAD4';
              return (
                <div key={sub.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F7F6F3] last:border-0 hover:bg-[#FAFAF8] transition-colors">
                  <div className="w-0.5 h-9 rounded-full shrink-0" style={{ background: accentColor }} />
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {sub.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{sub.studentName}</span>
                      <CategoryBadge category={sub.eventCategory} />
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: '#888' }}>{sub.event} · {sub.fileName}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs" style={{ color: '#aaa' }}>{formatRelative(sub.submittedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#EEECE8] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#aaa' }} />
              <h2 className="text-sm font-bold text-gray-900">Review Progress</h2>
            </div>
            <div className="mb-2 flex justify-between text-xs" style={{ color: '#888' }}>
              <span>Overall completion</span>
              <span className="font-bold text-gray-900">{reviewRate}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: '#F0EEE9' }}>
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${reviewRate}%` }} />
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Product Events',      count: byCategory.product,      color: '#3b82f6' },
                { label: 'Presentation Events', count: byCategory.presentation, color: '#8b5cf6' },
                { label: 'Testing Events',      count: byCategory.testing,      color: '#14b8a6' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                  <span className="text-xs flex-1" style={{ color: '#666' }}>{row.label}</span>
                  <span className="text-xs font-bold text-gray-900">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EEECE8] rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              {[
                { href: '/officer/submissions', label: 'Review pending submissions', count: pending },
                { href: '/officer/members',     label: 'Check missing members',      count: missing },
                { href: '/officer/deadlines',   label: 'Manage deadlines',           count: null },
              ].map(action => (
                <Link key={action.href} href={action.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F7F6F3] transition-colors"
                  style={{ border: '1px solid #F0EEE9' }}
                >
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                  {action.count !== null && action.count > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">{action.count}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
