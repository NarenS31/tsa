'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { Search, ChevronDown, CheckCircle, Clock, AlertTriangle, UserX, ChevronRight, ChevronUp } from 'lucide-react';
import { EventCategory, Submission, SubmissionStatus } from '@/lib/types';

const EXPECTED_TYPES: Submission['submissionType'][] = ['draft1', 'draft2', 'final'];

function typeLabel(t: Submission['submissionType']) {
  return { draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting' }[t];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStudentSummaryStatus(statuses: SubmissionStatus[]): SubmissionStatus {
  if (statuses.length === 0) return 'missing';
  if (statuses.some(s => s === 'needs_revision')) return 'needs_revision';
  if (statuses.some(s => s === 'pending')) return 'pending';
  if (statuses.every(s => s === 'reviewed')) return 'reviewed';
  return 'pending';
}

export default function MembersPage() {
  const { students, submissions } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const memberData = useMemo(() => {
    return students.map(student => {
      const subs = submissions.filter(s => s.studentId === student.id);
      const submitted = subs.map(s => s.submissionType);
      const completedCount = EXPECTED_TYPES.filter(t => submitted.includes(t)).length;
      const progress = Math.round((completedCount / EXPECTED_TYPES.length) * 100);
      const summaryStatus = getStudentSummaryStatus(subs.map(s => s.status));
      return { student, subs, completedCount, progress, summaryStatus };
    });
  }, [students, submissions]);

  const filtered = useMemo(() => {
    return memberData.filter(({ student }) => {
      const q = search.toLowerCase();
      const matchSearch = !q || student.name.toLowerCase().includes(q) || student.event.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || student.eventCategory === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [memberData, search, categoryFilter]);

  const stats = {
    total: students.length,
    onTrack: memberData.filter(m => m.summaryStatus === 'reviewed' || m.summaryStatus === 'pending').length,
    needsRevision: memberData.filter(m => m.summaryStatus === 'needs_revision').length,
    missing: memberData.filter(m => m.summaryStatus === 'missing').length,
  };

  const catProgressColor =
    (cat: EventCategory) => cat === 'product' ? 'bg-blue-500' : cat === 'presentation' ? 'bg-purple-500' : 'bg-teal-500';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Members</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Submission progress across all {students.length} club members.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {[
          { label: 'Total Members',  value: stats.total,        color: 'text-gray-900',   accent: 'border-l-gray-300' },
          { label: 'On Track',       value: stats.onTrack,      color: 'text-green-700',  accent: 'border-l-green-500' },
          { label: 'Needs Revision', value: stats.needsRevision,color: 'text-orange-700', accent: 'border-l-orange-500' },
          { label: 'No Submissions', value: stats.missing,      color: 'text-red-600',    accent: 'border-l-red-500' },
        ].map(card => (
          <div key={card.label} className={`bg-white rounded-xl px-5 py-4 border-l-[3px] ${card.accent}`}>
            <span className="block text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#999' }}>
              {card.label}
            </span>
            <p className={`text-4xl font-bold leading-none ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search members or events..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as EventCategory | 'all')}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="product">Product</option>
            <option value="presentation">Presentation</option>
            <option value="testing">Testing</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(({ student, subs, completedCount, progress, summaryStatus }) => {
          const isExpanded = expandedId === student.id;
          const progressColor = catProgressColor(student.eventCategory);
          return (
            <div key={student.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : student.id)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                    <span className="text-xs text-gray-400">Grade {student.grade}</span>
                    <CategoryBadge category={student.eventCategory} />
                  </div>
                  <p className="text-xs text-gray-500">{student.event}</p>
                </div>

                <div className="hidden sm:flex items-center gap-3 shrink-0">
                  <div className="w-28">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{completedCount}/{EXPECTED_TYPES.length} submitted</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor} rounded-full transition-all`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={summaryStatus} />
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="sm:hidden mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Submission progress</span>
                      <span>{completedCount}/{EXPECTED_TYPES.length} · {progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Submission Breakdown</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                    {EXPECTED_TYPES.map(type => {
                      const sub = subs.find(s => s.submissionType === type);
                      return (
                        <div key={type} className={`rounded-lg border px-3 py-2.5 ${sub ? 'bg-white border-gray-200' : 'bg-red-50 border-red-100'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{typeLabel(type)}</span>
                            {sub ? <StatusBadge status={sub.status} /> : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">Missing</span>
                            )}
                          </div>
                          {sub ? (
                            <>
                              <p className="text-xs text-gray-500 truncate">{sub.fileName}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(sub.submittedAt)} · {sub.fileSize}</p>
                            </>
                          ) : (
                            <p className="text-xs text-red-400">Not submitted yet</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {subs.filter(s => s.feedback).length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Officer Feedback</h3>
                      <div className="space-y-2">
                        {subs.filter(s => s.feedback).map(sub => (
                          <div key={sub.id} className="bg-white border border-indigo-100 rounded-lg px-3 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-indigo-700">{typeLabel(sub.submissionType)}</span>
                              <span className="text-xs text-gray-400">by {sub.reviewedBy}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{sub.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
