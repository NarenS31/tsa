'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { Search, SlidersHorizontal, Plus, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { EventCategory, SubmissionStatus } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_BADGE: Record<EventCategory, { label: string; className: string }> = {
  product:      { label: 'Product',      className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  presentation: { label: 'Presentation', className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  testing:      { label: 'Testing',      className: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' },
};

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; dot: string }> = {
  reviewed:       { label: 'Reviewed',       dot: 'bg-emerald-500' },
  pending:        { label: 'Pending',        dot: 'bg-amber-400' },
  needs_revision: { label: 'Needs Revision', dot: 'bg-orange-500' },
  missing:        { label: 'No submissions', dot: 'bg-rose-500' },
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  show:   { opacity: 1, scale: 1,    y: 0  },
  exit:   { opacity: 0, scale: 0.95, y: -4 },
} as const;

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getAvatarColor(id: string) {
  const colors = [
    'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700',
    'bg-teal-100 text-teal-700', 'bg-indigo-100 text-indigo-700',
    'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700',
  ];
  return colors[id.charCodeAt(id.length - 1) % colors.length];
}

function getSummaryStatus(statuses: SubmissionStatus[]): SubmissionStatus {
  if (statuses.length === 0) return 'missing';
  if (statuses.some(s => s === 'needs_revision')) return 'needs_revision';
  if (statuses.every(s => s === 'reviewed')) return 'reviewed';
  return 'pending';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions);
}

export default function MembersPage() {
  const { students, submissions } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const memberData = useMemo(() => {
    return students.map(student => {
      const subs = submissions.filter(s => s.studentId === student.id);
      const summaryStatus = getSummaryStatus(subs.map(s => s.status));
      const sorted = [...subs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      return { student, summaryStatus, lastActive: sorted[0]?.submittedAt };
    });
  }, [students, submissions]);

  const filtered = useMemo(() => {
    return memberData.filter(({ student }) => {
      const q = search.toLowerCase();
      const matchSearch = !q || student.name.toLowerCase().includes(q) || student.email.toLowerCase().includes(q) || student.event.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'all' || student.eventCategory === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [memberData, search, categoryFilter]);

  const allSelected = filtered.length > 0 && filtered.every(({ student }) => selected.has(student.id));

  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) filtered.forEach(({ student }) => next.delete(student.id));
    else filtered.forEach(({ student }) => next.add(student.id));
    setSelected(next);
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50"
    >
      <div className="px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Member management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your club members and their event assignments here.</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">All members</span>
            <motion.span
              key={filtered.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-gray-100 text-xs font-medium text-gray-600"
            >
              {filtered.length}
            </motion.span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="pl-9 pr-3 py-2 w-56 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {categoryFilter !== 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-900 ml-0.5" />
                )}
              </button>
              <AnimatePresence>
                {openMenu === 'filter' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="show" exit="exit"
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 origin-top-right"
                  >
                    {(['all', 'product', 'presentation', 'testing'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setCategoryFilter(opt); setOpenMenu(null); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${categoryFilter === opt ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                      >
                        {categoryFilter === opt && <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />}
                        {opt === 'all' ? 'All Categories' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-10 pl-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-gray-900"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    User name <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">Event</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    Last active <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs">Grade</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence initial={false}>
                {filtered.map(({ student, summaryStatus, lastActive }, i) => {
                  const cat = CATEGORY_BADGE[student.eventCategory];
                  const statusCfg = STATUS_CONFIG[summaryStatus];
                  const isSelected = selected.has(student.id);
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}
                      className={`group hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                    >
                      <td className="pl-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(student.id)}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-gray-900"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(student.id)}`}>
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.className}`}>
                            {cat.label}
                          </span>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                            {student.event}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                          <span className="text-xs text-gray-600">{statusCfg.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {lastActive ? formatDate(lastActive) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">Grade {student.grade}</td>
                      <td className="py-3.5 pr-3">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setOpenMenu(openMenu === student.id ? null : student.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {openMenu === student.id && (
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden" animate="show" exit="exit"
                                className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 origin-top-right"
                              >
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">View profile</button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit details</button>
                                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Send message</button>
                                <div className="border-t border-gray-100 my-1" />
                                <button className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50">Remove</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-400 text-sm"
            >
              No members match your search.
            </motion.div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3 text-right">
          Showing {filtered.length} of {students.length} members
        </p>
      </div>

      {openMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />
      )}
    </motion.div>
  );
}
