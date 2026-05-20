'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { Upload, CalendarDays, ChevronRight, MessageSquare } from 'lucide-react';
import { Submission } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

function typeLabel(t: Submission['submissionType']) {
  return { draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting Docs' }[t];
}

export default function StudentDashboard() {
  const { currentStudent, submissions, deadlines } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentStudent) router.push('/');
  }, [currentStudent, router]);

  if (!currentStudent) return null;

  const mySubmissions = submissions.filter(s => s.studentId === currentStudent.id);
  const reviewed = mySubmissions.filter(s => s.status === 'reviewed').length;
  const pending = mySubmissions.filter(s => s.status === 'pending').length;
  const needsRevision = mySubmissions.filter(s => s.status === 'needs_revision').length;
  const latestSubmissions = [...mySubmissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 4);

  const upcoming = deadlines
    .filter(d => new Date(d.date) > new Date() && (d.forAll || d.event === currentStudent.event))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const statCards = [
    { label: 'Total Submitted', value: mySubmissions.length, color: 'text-gray-900',   accent: 'border-l-gray-300' },
    { label: 'Reviewed',        value: reviewed,             color: 'text-green-700',  accent: 'border-l-green-500' },
    { label: 'Pending Review',  value: pending,              color: 'text-amber-600',  accent: 'border-l-amber-400' },
    { label: 'Needs Revision',  value: needsRevision,        color: 'text-orange-700', accent: 'border-l-orange-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
            Good morning, {currentStudent.name.split(' ')[0]}
          </h1>
          <p className="text-sm mt-1.5 flex items-center gap-2" style={{ color: '#888' }}>
            <CategoryBadge category={currentStudent.eventCategory} />
            {currentStudent.event}
          </p>
        </div>
        <Link
          href="/student/submit"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Submit Work
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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
            <Link href="/student/history" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {latestSubmissions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: '#888' }}>No submissions yet.</p>
              <Link href="/student/submit" className="text-xs text-indigo-600 hover:underline mt-1 block">
                Submit your first draft
              </Link>
            </div>
          ) : (
            <div>
              {latestSubmissions.map(sub => (
                <div key={sub.id} className="px-6 py-4 border-b border-[#F7F6F3] last:border-0 hover:bg-[#FAFAF8] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{typeLabel(sub.submissionType)}</span>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-xs truncate" style={{ color: '#888' }}>{sub.fileName}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{formatRelative(sub.submittedAt)}</p>
                    </div>
                  </div>
                  {sub.feedback && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-md px-3 py-2.5" style={{ background: '#F7F6F3' }}>
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#aaa' }} />
                      <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{sub.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#EEECE8] rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEE9]">
            <h2 className="text-sm font-bold text-gray-900">Upcoming Deadlines</h2>
            <Link href="/student/deadlines" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: '#888' }}>No upcoming deadlines.</p>
            </div>
          ) : (
            <div>
              {upcoming.map(dl => {
                const daysLeft = Math.ceil((new Date(dl.date).getTime() - Date.now()) / 86400000);
                const urgencyColor = daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#d97706' : '#999';
                return (
                  <div key={dl.id} className="px-6 py-4 border-b border-[#F7F6F3] last:border-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{dl.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarDays className="w-3.5 h-3.5" style={{ color: '#aaa' }} />
                      <span className="text-xs" style={{ color: '#888' }}>{formatDate(dl.date)}</span>
                    </div>
                    <p className="text-xs font-bold mt-1" style={{ color: urgencyColor }}>
                      {daysLeft <= 0 ? 'Past due' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft} days left`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
