'use client';

import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { ChevronRight, Trophy, AlertTriangle, Users, FileCheck, Clock } from 'lucide-react';
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function OfficerDashboard() {
  const { submissions, students, settings } = useApp();

  const total        = submissions.length;
  const reviewed     = submissions.filter(s => s.status === 'reviewed').length;
  const pending      = submissions.filter(s => s.status === 'pending').length;
  const needsRevision = submissions.filter(s => s.status === 'needs_revision').length;
  const studentsWithSubs = new Set(submissions.map(s => s.studentId));
  const missingStudents = students.filter(s => !studentsWithSubs.has(s.id));
  const reviewRate   = total > 0 ? Math.round((reviewed / total) * 100) : 0;
  const recent       = [...submissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);

  const daysToComp   = Math.ceil((new Date(settings.competitionDate).getTime() - Date.now()) / 86400000);

  const byCategory = [
    { label: 'Product',      count: submissions.filter(s => s.eventCategory === 'product').length,      color: 'bg-blue-500',   light: 'bg-blue-100' },
    { label: 'Presentation', count: submissions.filter(s => s.eventCategory === 'presentation').length, color: 'bg-purple-500', light: 'bg-purple-100' },
    { label: 'Testing',      count: submissions.filter(s => s.eventCategory === 'testing').length,      color: 'bg-teal-500',   light: 'bg-teal-100' },
  ];

  // Students who need follow-up (needs_revision or no submissions)
  const needsRevisionStudents = students.filter(s =>
    submissions.some(sub => sub.studentId === s.id && sub.status === 'needs_revision')
  );
  const atRisk = [
    ...missingStudents.map(s => ({ ...s, reason: 'No submissions' as const, urgency: 'high' as const })),
    ...needsRevisionStudents.map(s => ({ ...s, reason: 'Needs revision' as const, urgency: 'medium' as const })),
  ].slice(0, 6);

  const statCards = [
    { label: 'Total',          value: total,          sub: 'submissions',     color: 'text-gray-900',   icon: FileCheck,      iconBg: 'bg-gray-100',    iconColor: 'text-gray-500' },
    { label: 'Reviewed',       value: reviewed,       sub: `${reviewRate}%`,  color: 'text-emerald-700',icon: FileCheck,      iconBg: 'bg-emerald-50',  iconColor: 'text-emerald-600' },
    { label: 'Pending',        value: pending,        sub: 'awaiting review', color: 'text-amber-600',  icon: Clock,          iconBg: 'bg-amber-50',    iconColor: 'text-amber-500' },
    { label: 'Needs Revision', value: needsRevision,  sub: 'flagged',         color: 'text-orange-600', icon: AlertTriangle,  iconBg: 'bg-orange-50',   iconColor: 'text-orange-500' },
    { label: 'Missing',        value: missingStudents.length, sub: 'members', color: 'text-rose-600',   icon: Users,          iconBg: 'bg-rose-50',     iconColor: 'text-rose-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="p-6"
    >
      {/* ── Hero ── */}
      <div className="mb-6 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · Marvin Ridge TSA
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Officer Dashboard</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border ${
            daysToComp <= 30
              ? 'bg-red-50 border-red-200'
              : daysToComp <= 60
              ? 'bg-amber-50 border-amber-200'
              : 'bg-indigo-50 border-indigo-200'
          }`}
        >
          <Trophy className={`w-5 h-5 shrink-0 ${
            daysToComp <= 30 ? 'text-red-500' : daysToComp <= 60 ? 'text-amber-500' : 'text-indigo-500'
          }`} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">State Competition</p>
            <p className={`text-xl font-bold leading-none ${
              daysToComp <= 30 ? 'text-red-700' : daysToComp <= 60 ? 'text-amber-700' : 'text-indigo-700'
            }`}>
              {daysToComp} <span className="text-sm font-normal text-gray-400">days away</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold leading-none ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Middle row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        {/* Needs Attention */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Needs Attention</h2>
              {atRisk.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                  {atRisk.length}
                </span>
              )}
            </div>
            <Link href="/officer/members" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              All members <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {atRisk.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-emerald-600 font-medium">All members are on track</p>
              <p className="text-xs text-gray-400 mt-1">No action needed right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {atRisk.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + i * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                    {getInitials(student.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-400 truncate">{student.event}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    student.urgency === 'high'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-orange-50 text-orange-600'
                  }`}>
                    {student.reason}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Review Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Review Progress</h2>

          {/* Overall ring-style indicator */}
          <div className="flex items-center gap-5 mb-5 p-4 bg-gray-50 rounded-xl">
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - reviewRate }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                {reviewRate}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Overall reviewed</p>
              <p className="text-xs text-gray-400 mt-0.5">{reviewed} of {total} submissions</p>
            </div>
          </div>

          <div className="space-y-3">
            {byCategory.map((cat, i) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-600 font-medium">{cat.label}</span>
                    <span className="text-gray-400">{cat.count} submissions</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${cat.light}`}>
                    <motion.div
                      className={`h-full rounded-full ${cat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-5">
            <Link
              href="/officer/submissions"
              className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Review pending ({pending})
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Recent submissions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Recent Submissions</h2>
          <Link href="/officer/submissions" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map((sub, i) => {
            const accentColor = sub.eventCategory === 'product' ? '#93C5FD' : sub.eventCategory === 'presentation' ? '#C4B5FD' : '#5EEAD4';
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-1 h-8 rounded-full shrink-0" style={{ background: accentColor }} />
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                  {getInitials(sub.studentName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{sub.studentName}</span>
                    <CategoryBadge category={sub.eventCategory} />
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{sub.event} · {sub.fileName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={sub.status} />
                  <span className="text-xs text-gray-300">{formatRelative(sub.submittedAt)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
