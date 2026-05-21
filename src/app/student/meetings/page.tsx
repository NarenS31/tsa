'use client';

import { useApp } from '@/lib/AppContext';
import { MapPin, Clock, CalendarDays, CheckCircle, XCircle, Globe, Tag } from 'lucide-react';
import { EventCategory } from '@/lib/types';

const CAT_COLORS: Record<EventCategory, string> = {
  product:      'bg-blue-50 text-blue-700 border-blue-200',
  presentation: 'bg-purple-50 text-purple-700 border-purple-200',
  testing:      'bg-teal-50 text-teal-700 border-teal-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

export default function StudentMeetingsPage() {
  const { currentStudent, meetings, rsvpMeeting, showToast } = useApp();

  if (!currentStudent) return null;

  const myMeetings = meetings.filter(m => {
    if (m.appliesTo === 'all') return true;
    if (m.appliesTo === 'category') return m.category === currentStudent.eventCategory;
    if (m.appliesTo === 'specific') return m.studentIds?.includes(currentStudent.id) ?? false;
    return false;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const now = new Date();
  const upcoming = myMeetings.filter(m => new Date(m.date) > now);
  const past = myMeetings.filter(m => new Date(m.date) <= now);

  const handleRsvp = (meetingId: string, status: 'going' | 'not_going') => {
    rsvpMeeting(meetingId, currentStudent.id, status);
    showToast(status === 'going' ? 'RSVP updated: Going!' : 'RSVP updated: Not Going', 'success');
  };

  const MeetingCard = ({ m }: { m: typeof meetings[0] }) => {
    const days = daysUntil(m.date);
    const isPast = days <= 0;
    const rsvp = m.rsvps[currentStudent.id];
    const urgency = isPast ? 'border-gray-200 opacity-60' : days <= 3 ? 'border-red-200 bg-red-50/30' : days <= 7 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200';
    const daysColor = isPast ? 'text-gray-400' : days <= 3 ? 'text-red-600 font-semibold' : days <= 7 ? 'text-amber-600 font-semibold' : 'text-gray-500';

    return (
      <div className={`bg-white rounded-xl border px-5 py-4 ${urgency}`}>
        <div className="flex items-start gap-4">
          <div className="w-10 text-center shrink-0 pt-0.5">
            <p className="text-xl font-bold text-gray-900 leading-none">{new Date(m.date).getDate()}</p>
            <p className="text-xs text-gray-400 uppercase">{new Date(m.date).toLocaleDateString('en-US', { month: 'short' })}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-semibold text-gray-900">{m.title}</p>
              {m.appliesTo === 'all' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  <Globe className="w-3 h-3" />All Members
                </span>
              ) : m.category ? (
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${CAT_COLORS[m.category]}`}>
                  <Tag className="w-3 h-3" />{m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                </span>
              ) : null}
            </div>
            {m.description && <p className="text-xs text-gray-500 mb-2">{m.description}</p>}
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatDate(m.date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(m.date)}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-sm ${daysColor}`}>
              {isPast ? 'Past' : days === 1 ? '1 day' : `${days} days`}
            </span>
            {!isPast && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleRsvp(m.id, 'going')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${rsvp === 'going' ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />Going
                </button>
                <button
                  onClick={() => handleRsvp(m.id, 'not_going')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${rsvp === 'not_going' ? 'bg-red-500 text-white border-red-500' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'}`}>
                  <XCircle className="w-3.5 h-3.5" />Can't Go
                </button>
              </div>
            )}
            {isPast && rsvp && (
              <span className={`text-xs px-2 py-1 rounded-full border ${rsvp === 'going' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {rsvp === 'going' ? 'Attended' : 'Didn\'t attend'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-500 mt-1">Meetings scheduled for you and your event.</p>
      </div>

      {myMeetings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-16 text-center">
          <p className="text-sm text-gray-500">No meetings scheduled yet.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
              <div className="space-y-3">{upcoming.map(m => <MeetingCard key={m.id} m={m} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Past ({past.length})</h2>
              <div className="space-y-3">{past.map(m => <MeetingCard key={m.id} m={m} />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
