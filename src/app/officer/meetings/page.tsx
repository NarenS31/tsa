'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { STUDENTS, EVENTS } from '@/lib/mockData';
import { Plus, X, MapPin, Clock, Users, ChevronDown, ChevronUp, Globe, Tag, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { EventCategory, AttendanceStatus } from '@/lib/types';

const CAT_COLORS: Record<EventCategory, string> = {
  product:      'bg-blue-50 text-blue-700 border-blue-200',
  presentation: 'bg-purple-50 text-purple-700 border-purple-200',
  testing:      'bg-teal-50 text-teal-700 border-teal-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function getMeetingParticipants(meeting: ReturnType<typeof useApp>['meetings'][0]) {
  if (meeting.appliesTo === 'all') return STUDENTS;
  if (meeting.appliesTo === 'category') return STUDENTS.filter(s => s.eventCategory === meeting.category);
  if (meeting.appliesTo === 'specific' && meeting.studentIds) return STUDENTS.filter(s => meeting.studentIds!.includes(s.id));
  return [];
}

const ATTENDANCE_CONFIG: Record<AttendanceStatus, { label: string; icon: typeof CheckCircle2; active: string; inactive: string }> = {
  present: { label: 'Present', icon: CheckCircle2, active: 'bg-emerald-100 text-emerald-700 border-emerald-300', inactive: 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50' },
  absent:  { label: 'Absent',  icon: XCircle,      active: 'bg-rose-100 text-rose-700 border-rose-300',         inactive: 'text-gray-400 hover:text-rose-600 hover:bg-rose-50' },
  excused: { label: 'Excused', icon: MinusCircle,  active: 'bg-amber-100 text-amber-700 border-amber-300',      inactive: 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' },
};

export default function OfficerMeetingsPage() {
  const { meetings, addMeeting, markAttendance, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('15:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [appliesTo, setAppliesTo] = useState<'all' | 'category'>('all');
  const [category, setCategory] = useState<EventCategory>('product');

  const now = new Date();
  const upcoming = meetings.filter(m => new Date(m.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = meetings.filter(m => new Date(m.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) return;
    addMeeting({ title, date: new Date(`${date}T${time}`).toISOString(), location, description, appliesTo, category: appliesTo === 'category' ? category : undefined });
    showToast('Meeting scheduled successfully.', 'success');
    setTitle(''); setDate(''); setTime('15:00'); setLocation(''); setDescription('');
    setAppliesTo('all'); setShowForm(false);
  };

  const MeetingCard = ({ m }: { m: typeof meetings[0] }) => {
    const days = daysUntil(m.date);
    const isPast = days <= 0;
    const urgency = isPast ? 'border-gray-200 opacity-60' : days <= 3 ? 'border-red-200' : days <= 7 ? 'border-amber-200' : 'border-gray-200';
    const daysColor = isPast ? 'text-gray-400' : days <= 3 ? 'text-red-600 font-semibold' : days <= 7 ? 'text-amber-600 font-semibold' : 'text-gray-500';
    const participants = getMeetingParticipants(m);
    const goingCount = Object.values(m.rsvps).filter(r => r === 'going').length;
    const notGoingCount = Object.values(m.rsvps).filter(r => r === 'not_going').length;
    const isExpanded = expandedId === m.id;

    return (
      <div className={`bg-white rounded-xl border overflow-hidden ${urgency}`}>
        <button className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : m.id)}>
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
              <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(m.date)}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{goingCount} going · {notGoingCount} not going · {participants.length - Object.keys(m.rsvps).length} no response</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-sm ${daysColor}`}>{isPast ? 'Past' : days === 1 ? '1 day' : `${days} days`}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
            {m.description && <p className="text-xs text-gray-600 mb-4">{m.description}</p>}

            {/* RSVP list */}
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">RSVPs ({participants.length})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {participants.map(student => {
                const rsvp = m.rsvps[student.id];
                const badge = rsvp === 'going' ? 'bg-green-50 text-green-700 border-green-200' :
                              rsvp === 'not_going' ? 'bg-red-50 text-red-600 border-red-200' :
                              'bg-gray-50 text-gray-500 border-gray-200';
                const label = rsvp === 'going' ? 'Going' : rsvp === 'not_going' ? 'Not Going' : 'No Response';
                return (
                  <div key={student.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{student.name}</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${badge} shrink-0`}>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Attendance tracking */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</h4>
                {(() => {
                  const marked = participants.filter(s => m.attendance?.[s.id]).length;
                  return marked > 0 ? (
                    <span className="text-[10px] text-gray-400">{marked}/{participants.length} marked</span>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">not yet marked</span>
                  );
                })()}
              </div>
              <div className="space-y-1.5">
                {participants.map(student => {
                  const current = m.attendance?.[student.id] ?? null;
                  return (
                    <div key={student.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="text-xs font-medium text-gray-900 flex-1 min-w-0 truncate">{student.name}</p>
                      <div className="flex gap-1 shrink-0">
                        {(Object.entries(ATTENDANCE_CONFIG) as [AttendanceStatus, typeof ATTENDANCE_CONFIG[AttendanceStatus]][]).map(([status, cfg]) => {
                          const Icon = cfg.icon;
                          const isActive = current === status;
                          return (
                            <button
                              key={status}
                              onClick={() => markAttendance(m.id, student.id, status)}
                              title={cfg.label}
                              className={`w-7 h-7 flex items-center justify-center rounded-md border transition-colors ${
                                isActive ? cfg.active : `border-transparent ${cfg.inactive}`
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and manage club meetings.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />Add Meeting
        </button>
      </div>

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

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Schedule Meeting</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="e.g. Weekly Club Meeting"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} required
                  placeholder="e.g. Room 204"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  placeholder="What's this meeting about?"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Applies To</label>
                <div className="flex gap-2">
                  {(['all', 'category'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setAppliesTo(t)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${appliesTo === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {t === 'all' ? 'All Members' : 'By Category'}
                    </button>
                  ))}
                </div>
              </div>
              {appliesTo === 'category' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['product', 'presentation', 'testing'] as EventCategory[]).map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`py-2 rounded-lg border text-xs font-medium capitalize transition-colors ${category === cat ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Schedule Meeting
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
