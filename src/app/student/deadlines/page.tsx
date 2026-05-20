'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CalendarDays, Clock } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function StudentDeadlinesPage() {
  const { currentStudent, deadlines } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentStudent) router.push('/');
  }, [currentStudent, router]);

  if (!currentStudent) return null;

  const now = new Date();
  const relevant = deadlines
    .filter(d => d.forAll || d.event === currentStudent.event)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcoming = relevant.filter(d => new Date(d.date) > now);
  const past = relevant.filter(d => new Date(d.date) <= now);

  const catBg =
    currentStudent.eventCategory === 'product' ? 'bg-blue-100 text-blue-700' :
    currentStudent.eventCategory === 'presentation' ? 'bg-purple-100 text-purple-700' :
    'bg-teal-100 text-teal-700';

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/student" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Deadlines</h1>
      <p className="text-sm text-gray-500 mb-8">Showing deadlines for all members and your event.</p>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map(dl => {
              const daysLeft = Math.ceil((new Date(dl.date).getTime() - now.getTime()) / 86400000);
              const urgency = daysLeft <= 3 ? 'border-red-200 bg-red-50' : daysLeft <= 7 ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white';
              const urgencyText = daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-gray-400';
              return (
                <div key={dl.id} className={`rounded-xl border px-5 py-4 ${urgency}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-gray-900">{dl.title}</p>
                        {!dl.forAll && dl.event && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catBg}`}>{dl.event}</span>
                        )}
                        {dl.forAll && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">All Members</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{dl.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatDate(dl.date)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(dl.date)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold shrink-0 ${urgencyText}`}>
                      {daysLeft === 1 ? '1 day' : `${daysLeft} days`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Past</h2>
          <div className="space-y-2">
            {past.map(dl => (
              <div key={dl.id} className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 opacity-60">
                <p className="text-sm font-medium text-gray-700">{dl.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(dl.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
