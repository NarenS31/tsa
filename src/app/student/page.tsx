'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, CalendarDays, ChevronRight, MessageSquare, CheckCircle, Clock, Circle, Trophy } from 'lucide-react';
import { Submission } from '@/lib/types';
import { motion } from 'framer-motion';

const STEPS: Submission['submissionType'][] = ['draft1', 'draft2', 'final'];
const STEP_LABELS: Record<string, string> = { draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatRelative(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

const STATUS_STYLE = {
  reviewed:       { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-700', label: 'Reviewed',       icon: CheckCircle },
  pending:        { bg: 'bg-amber-400',   ring: 'ring-amber-200',   text: 'text-amber-700',   label: 'Pending',        icon: Clock },
  needs_revision: { bg: 'bg-orange-500',  ring: 'ring-orange-200',  text: 'text-orange-700',  label: 'Needs Revision', icon: Clock },
  missing:        { bg: 'bg-gray-200',    ring: 'ring-gray-100',    text: 'text-gray-400',    label: 'Not submitted',  icon: Circle },
};

export default function StudentDashboard() {
  const { currentStudent, submissions, deadlines, settings } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentStudent) router.push('/');
  }, [currentStudent, router]);

  if (!currentStudent) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = currentStudent.name.split(' ')[0];

  const mySubmissions = submissions.filter(s => s.studentId === currentStudent.id);
  const reviewed     = mySubmissions.filter(s => s.status === 'reviewed').length;
  const pending      = mySubmissions.filter(s => s.status === 'pending').length;
  const needsRevision = mySubmissions.filter(s => s.status === 'needs_revision').length;
  const recent = [...mySubmissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 4);

  const upcoming = deadlines
    .filter(d => new Date(d.date) > new Date() && (d.forAll || d.event === currentStudent.event))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const daysToComp = Math.ceil((new Date(settings.competitionDate).getTime() - Date.now()) / 86400000);
  const compUrgency = daysToComp <= 30 ? 'text-red-600 bg-red-50 ring-red-200' : daysToComp <= 60 ? 'text-amber-600 bg-amber-50 ring-amber-200' : 'text-gray-600 bg-gray-100 ring-gray-200';

  const stepData = STEPS.map(type => {
    const sub = mySubmissions.find(s => s.submissionType === type);
    return { type, sub, status: sub ? sub.status : 'missing' as const };
  });

  const completedSteps = stepData.filter(s => s.status !== 'missing').length;
  const progressPct = Math.round((completedSteps / STEPS.length) * 100);

  const statCards = [
    { label: 'Submitted',      value: mySubmissions.length, color: 'text-gray-900',   bg: 'bg-gray-50' },
    { label: 'Reviewed',       value: reviewed,             color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Pending Review', value: pending,              color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Needs Revision', value: needsRevision,        color: 'text-orange-600',  bg: 'bg-orange-50' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="p-6 max-w-5xl"
    >
      {/* ── Hero ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentStudent.event} · Grade {currentStudent.grade}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${compUrgency}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {daysToComp} days to State
          </motion.div>
          <Link
            href="/student/submit"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Submit Work
          </Link>
        </div>
      </div>

      {/* ── Submission Journey ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Submission Journey</h2>
            <p className="text-xs text-gray-400 mt-0.5">{completedSteps} of {STEPS.length} submitted</p>
          </div>
          <span className="text-xs font-bold text-gray-500">{progressPct}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gray-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ delay: 0.4, duration: 0.7 }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-4">
          {stepData.map(({ type, sub, status }, i) => {
            const style = STATUS_STYLE[status];
            const Icon = style.icon;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className={`rounded-xl p-4 ring-1 ${style.ring} ${status === 'missing' ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{STEP_LABELS[type]}</span>
                </div>
                <p className={`text-xs font-medium ${style.text}`}>{style.label}</p>
                {sub && (
                  <p className="text-[11px] text-gray-400 mt-1 truncate">{sub.fileName}</p>
                )}
                {sub && (
                  <p className="text-[11px] text-gray-400">{formatRelative(sub.submittedAt)}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.3 }}
          className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Recent Submissions</h2>
            <Link href="/student/history" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">No submissions yet.</p>
              <Link href="/student/submit" className="text-xs text-gray-900 underline underline-offset-2 mt-1 block">
                Submit your first draft
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((sub, i) => {
                const style = STATUS_STYLE[sub.status];
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 + i * 0.05 }}
                    className="px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{STEP_LABELS[sub.submissionType]}</span>
                          <span className={`text-[11px] font-semibold ${style.text}`}>{style.label}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{sub.fileName}</p>
                      </div>
                      <span className="text-xs text-gray-300 shrink-0 mt-0.5">{formatRelative(sub.submittedAt)}</span>
                    </div>
                    {sub.feedback && (
                      <div className="mt-2.5 flex items-start gap-2 bg-indigo-50 rounded-lg px-3 py-2.5">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-indigo-400" />
                        <p className="text-xs leading-relaxed text-indigo-700">{sub.feedback}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h2>
            <Link href="/student/deadlines" className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">No upcoming deadlines.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map((dl, i) => {
                const daysLeft = Math.ceil((new Date(dl.date).getTime() - Date.now()) / 86400000);
                const urgency = daysLeft <= 3
                  ? 'text-red-600 bg-red-50'
                  : daysLeft <= 7
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-500 bg-gray-100';
                return (
                  <motion.div
                    key={dl.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + i * 0.05 }}
                    className="px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 leading-tight flex-1">{dl.title}</p>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${urgency}`}>
                        {daysLeft <= 0 ? 'Past due' : daysLeft === 1 ? '1 day' : `${daysLeft}d`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <CalendarDays className="w-3 h-3 text-gray-300" />
                      <span className="text-xs text-gray-400">{formatDate(dl.date)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
