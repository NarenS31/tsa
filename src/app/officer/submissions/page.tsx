'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { Search, Download, CheckCircle, RotateCcw, X, MessageSquare, FileText, ChevronDown } from 'lucide-react';
import { Submission, SubmissionStatus, EventCategory } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function typeLabel(t: Submission['submissionType']) {
  return { draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting' }[t];
}

function FeedbackModal({ submission, onClose, onSave }: {
  submission: Submission;
  onClose: () => void;
  onSave: (feedback: string) => void;
}) {
  const [text, setText] = useState(submission.feedback ?? '');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Leave Feedback</h2>
            <p className="text-xs text-gray-500 mt-0.5">{submission.studentName} · {submission.event} · {typeLabel(submission.submissionType)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-4">
          <div className="mb-3 bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Student Notes</p>
            <p className="text-sm text-gray-700">{submission.notes || 'No notes provided.'}</p>
          </div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Your Feedback</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder="Write constructive feedback for the student..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave(text)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Save Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  const { submissions, updateSubmissionStatus, addFeedback, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [feedbackTarget, setFeedbackTarget] = useState<Submission | null>(null);

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.studentName.toLowerCase().includes(q) || s.event.toLowerCase().includes(q) || s.fileName.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchCat = categoryFilter === 'all' || s.eventCategory === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [submissions, search, statusFilter, categoryFilter]);

  const handleMarkReviewed = (id: string) => {
    updateSubmissionStatus(id, 'reviewed');
    showToast('Marked as reviewed.', 'success');
  };

  const handleMarkRevision = (id: string) => {
    updateSubmissionStatus(id, 'needs_revision');
    showToast('Marked as needs revision.', 'info');
  };

  const handleSaveFeedback = (feedback: string) => {
    if (!feedbackTarget) return;
    addFeedback(feedbackTarget.id, feedback);
    showToast('Feedback saved successfully.', 'success');
    setFeedbackTarget(null);
  };

  const exportCSV = () => {
    const headers = ['Student', 'Event', 'Category', 'Type', 'Status', 'File', 'Submitted', 'Reviewed By', 'Feedback'];
    const rows = filtered.map(s => [
      s.studentName, s.event, s.eventCategory,
      typeLabel(s.submissionType), s.status, s.fileName,
      formatDate(s.submittedAt), s.reviewedBy ?? '',
      (s.feedback ?? '').replace(/,/g, ';'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tsa_submissions.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully.', 'success');
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Submissions</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>{filtered.length} submission{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, event, or file..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="needs_revision">Needs Revision</option>
            <option value="missing">Missing</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as EventCategory | 'all')}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="product">Product</option>
            <option value="presentation">Presentation</option>
            <option value="testing">Testing</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white border border-[#EEECE8] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F6F3]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No submissions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                          {sub.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{sub.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 whitespace-nowrap">{sub.event}</span>
                        <CategoryBadge category={sub.eventCategory} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{typeLabel(sub.submissionType)}</td>
                    <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-600 truncate max-w-32">{sub.fileName}</span>
                        <span className="text-gray-400 text-xs shrink-0">{sub.fileSize}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(sub.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMarkReviewed(sub.id)}
                          disabled={sub.status === 'reviewed'}
                          title="Mark as Reviewed"
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMarkRevision(sub.id)}
                          disabled={sub.status === 'needs_revision'}
                          title="Mark as Needs Revision"
                          className="p-1.5 rounded-md text-orange-600 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setFeedbackTarget(sub)}
                          title="Leave Feedback"
                          className="p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {feedbackTarget && (
        <FeedbackModal
          submission={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onSave={handleSaveFeedback}
        />
      )}
    </div>
  );
}
