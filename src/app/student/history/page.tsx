'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { ChevronLeft, FileText, MessageSquare, Upload } from 'lucide-react';
import { Submission } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function typeLabel(t: Submission['submissionType']) {
  return { draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting Docs' }[t];
}

export default function HistoryPage() {
  const { currentStudent, submissions } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentStudent) router.push('/');
  }, [currentStudent, router]);

  if (!currentStudent) return null;

  const mySubmissions = [...submissions.filter(s => s.studentId === currentStudent.id)]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const grouped: Record<string, Submission[]> = {};
  mySubmissions.forEach(sub => {
    if (!grouped[sub.submissionType]) grouped[sub.submissionType] = [];
    grouped[sub.submissionType].push(sub);
  });

  const ORDER: Submission['submissionType'][] = ['draft1', 'draft2', 'final', 'supporting'];
  const orderedGroups = ORDER.filter(k => grouped[k]);

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/student" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Submission History</h1>
          <p className="text-sm text-gray-500 mt-1">{mySubmissions.length} submission{mySubmissions.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/student/submit"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          New Submission
        </Link>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-16 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900">No submissions yet</p>
          <p className="text-xs text-gray-500 mt-1">Your submission history will appear here.</p>
          <Link href="/student/submit" className="mt-4 inline-block text-xs text-indigo-600 hover:underline">
            Submit your first draft →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orderedGroups.map(type => (
            <div key={type} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">{typeLabel(type)}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {grouped[type].map((sub, idx) => (
                  <div key={sub.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                          v{grouped[type].length - idx}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900 truncate">{sub.fileName}</p>
                            <StatusBadge status={sub.status} />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{sub.fileSize} · Submitted {formatDate(sub.submittedAt)}</p>
                          {sub.reviewedAt && (
                            <p className="text-xs text-gray-400 mt-0.5">Reviewed {formatDate(sub.reviewedAt)} by {sub.reviewedBy}</p>
                          )}
                          {sub.notes && (
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{sub.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {sub.feedback && (
                      <div className="mt-3 flex items-start gap-2.5 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-indigo-700 mb-0.5">Officer Feedback</p>
                          <p className="text-xs text-indigo-900 leading-relaxed">{sub.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
