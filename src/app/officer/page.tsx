'use client';

import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { label: 'Total Submissions', value: total,         color: 'text-slate-900',   accent: 'border-l-slate-300' },
    { label: 'Reviewed',          value: reviewed,      color: 'text-emerald-700', accent: 'border-l-emerald-500' },
    { label: 'Pending Review',    value: pending,       color: 'text-amber-600',   accent: 'border-l-amber-400' },
    { label: 'Needs Revision',    value: needsRevision, color: 'text-orange-700',  accent: 'border-l-orange-500' },
    { label: 'Missing',           value: missing,       color: 'text-rose-600',    accent: 'border-l-rose-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Officer Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Overview of all TSA club submissions and member activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className={`rounded-2xl border border-slate-200 border-l-4 ${card.accent} bg-white p-3 shadow-sm hover:shadow-md transition-shadow`}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 mb-2">
              {card.label}
            </span>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="lg:col-span-2 bg-white border border-[#EEECE8] rounded-xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEE9]">
            <h2 className="text-sm font-bold text-gray-900">Recent Submissions</h2>
            <Link href="/officer/submissions" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            {recent.map((sub, i) => {
              const accentColor =
                sub.eventCategory === 'product' ? '#93C5FD' :
                sub.eventCategory === 'presentation' ? '#C4B5FD' : '#5EEAD4';
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.22 }}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-[#F7F6F3] last:border-0 hover:bg-[#FAFAF8] transition-colors"
                >
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Side panels */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="bg-white border border-[#EEECE8] rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#aaa' }} />
              <h2 className="text-sm font-bold text-gray-900">Review Progress</h2>
            </div>
            <div className="mb-2 flex justify-between text-xs" style={{ color: '#888' }}>
              <span>Overall completion</span>
              <span className="font-bold text-gray-900">{reviewRate}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: '#F0EEE9' }}>
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${reviewRate}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Product Events',      count: byCategory.product,      color: '#3b82f6' },
                { label: 'Presentation Events', count: byCategory.presentation, color: '#8b5cf6' },
                { label: 'Testing Events',      count: byCategory.testing,      color: '#14b8a6' },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                  <span className="text-xs flex-1" style={{ color: '#666' }}>{row.label}</span>
                  <span className="text-xs font-bold text-gray-900">{row.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.3 }}
            className="bg-white border border-[#EEECE8] rounded-xl p-5"
          >
            <h2 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              {[
                { href: '/officer/submissions', label: 'Review pending submissions', count: pending },
                { href: '/officer/members',     label: 'Check missing members',      count: missing },
                { href: '/officer/deadlines',   label: 'Manage deadlines',           count: null },
              ].map((action, i) => (
                <motion.div
                  key={action.href}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F7F6F3] transition-colors"
                    style={{ border: '1px solid #F0EEE9' }}
                  >
                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                    {action.count !== null && action.count > 0 && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">{action.count}</span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
