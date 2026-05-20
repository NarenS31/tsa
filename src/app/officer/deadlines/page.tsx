'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { CalendarDays, Clock, Plus, X, Globe, Tag } from 'lucide-react';
import { Deadline, EventCategory } from '@/lib/types';
import { EVENTS } from '@/lib/mockData';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

const CAT_COLORS: Record<EventCategory, string> = {
  product: 'bg-blue-50 text-blue-700 border-blue-200',
  presentation: 'bg-purple-50 text-purple-700 border-purple-200',
  testing: 'bg-teal-50 text-teal-700 border-teal-200',
};

const ALL_EVENTS = Object.values(EVENTS).flat();

export default function DeadlinesPage() {
  const { deadlines, addDeadline, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('23:59');
  const [description, setDescription] = useState('');
  const [forAll, setForAll] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | ''>('');

  const now = new Date();
  const upcoming = deadlines.filter(d => new Date(d.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = deadlines.filter(d => new Date(d.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    addDeadline({
      title,
      date: new Date(`${date}T${time}`).toISOString(),
      description,
      forAll,
      event: !forAll && selectedEvent ? selectedEvent : undefined,
      eventCategory: !forAll && selectedCategory ? selectedCategory as EventCategory : undefined,
    });
    showToast('Deadline added successfully.', 'success');
    setTitle(''); setDate(''); setTime('23:59'); setDescription('');
    setForAll(true); setSelectedEvent(''); setSelectedCategory('');
    setShowForm(false);
  };

  const getEventCategory = (eventName: string): EventCategory | undefined => {
    if (EVENTS.product.includes(eventName)) return 'product';
    if (EVENTS.presentation.includes(eventName)) return 'presentation';
    if (EVENTS.testing.includes(eventName)) return 'testing';
    return undefined;
  };

  const handleEventChange = (event: string) => {
    setSelectedEvent(event);
    const cat = getEventCategory(event);
    if (cat) setSelectedCategory(cat);
  };

  const DeadlineCard = ({ dl }: { dl: Deadline }) => {
    const days = daysUntil(dl.date);
    const isPast = days <= 0;
    const urgency = isPast ? 'opacity-60' : days <= 3 ? 'border-red-200' : days <= 7 ? 'border-amber-200' : 'border-gray-200';
    const daysColor = days <= 0 ? 'text-gray-400' : days <= 3 ? 'text-red-600 font-semibold' : days <= 7 ? 'text-amber-600 font-semibold' : 'text-gray-500';

    return (
      <div className={`bg-white rounded-xl border px-5 py-4 ${urgency}`}>
        <div className="flex items-start gap-4">
          <div className="w-10 text-center shrink-0 pt-0.5">
            <p className="text-xl font-bold text-gray-900 leading-none">{new Date(dl.date).getDate()}</p>
            <p className="text-xs text-gray-400 uppercase">{new Date(dl.date).toLocaleDateString('en-US', { month: 'short' })}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-semibold text-gray-900">{dl.title}</p>
              {dl.forAll ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  <Globe className="w-3 h-3" />All Members
                </span>
              ) : dl.eventCategory ? (
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${CAT_COLORS[dl.eventCategory]}`}>
                  <Tag className="w-3 h-3" />{dl.event}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 mb-2">{dl.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />{formatDate(dl.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{formatTime(dl.date)}
              </span>
            </div>
          </div>
          <div className={`text-sm shrink-0 ${daysColor}`}>
            {days <= 0 ? 'Past' : days === 1 ? '1 day' : `${days} days`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Deadlines</h1>
          <p className="text-sm text-gray-500 mt-1">Manage upcoming dates for all members.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deadline
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
          <div className="space-y-3">
            {upcoming.map(dl => <DeadlineCard key={dl.id} dl={dl} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Past ({past.length})</h2>
          <div className="space-y-3">
            {past.map(dl => <DeadlineCard key={dl.id} dl={dl} />)}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Add Deadline</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  value={title} onChange={e => setTitle(e.target.value)} required
                  placeholder="e.g. Draft 2 Submissions Due"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date" value={date} onChange={e => setDate(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Time</label>
                  <input
                    type="time" value={time} onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  placeholder="Additional details..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Applies To</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setForAll(true)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${forAll ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    All Members
                  </button>
                  <button type="button" onClick={() => setForAll(false)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${!forAll ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    Specific Event
                  </button>
                </div>
              </div>
              {!forAll && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Event</label>
                  <select
                    value={selectedEvent} onChange={e => handleEventChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an event</option>
                    {ALL_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Add Deadline
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
