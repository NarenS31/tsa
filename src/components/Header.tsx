'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import { Search, Users, FileText, CalendarDays, CalendarCheck, X, Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'member' | 'submission' | 'deadline' | 'meeting';
  title: string;
  subtitle: string;
  href: string;
}

const PAGE_LABELS: Record<string, string> = {
  '/officer':              'Dashboard',
  '/officer/submissions':  'Submissions',
  '/officer/members':      'Members',
  '/officer/deadlines':    'Deadlines',
  '/officer/meetings':     'Meetings',
  '/officer/analytics':    'Analytics',
  '/officer/messages':     'Messages',
  '/officer/resources':    'Resources',
  '/officer/settings':     'Settings',
  '/student':              'Dashboard',
  '/student/submit':       'Submit Work',
  '/student/history':      'History',
  '/student/deadlines':    'Deadlines',
  '/student/meetings':     'Meetings',
  '/student/messages':     'Messages',
  '/student/resources':    'Resources',
};

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

export default function Header({ variant }: { variant: 'student' | 'officer' }) {
  const { students, submissions, deadlines, meetings, currentStudent, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pageTitle = PAGE_LABELS[pathname] ?? '';

  const myNotifs = notifications.filter(n =>
    variant === 'officer' ? n.forUserId === 'officer' : n.forUserId === currentStudent?.id
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const typeLabel = (t: string) =>
    ({ draft1: 'Draft 1', draft2: 'Draft 2', final: 'Final', supporting: 'Supporting' }[t] ?? t);

  const results: SearchResult[] = useCallback(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];

    if (variant === 'officer') {
      students.filter(s => s.name.toLowerCase().includes(q) || s.event.toLowerCase().includes(q)).slice(0, 3).forEach(s => {
        out.push({ id: s.id, type: 'member', title: s.name, subtitle: s.event, href: '/officer/members' });
      });
    }

    const mySubmissions = variant === 'student' && currentStudent
      ? submissions.filter(s => s.studentId === currentStudent.id)
      : submissions;

    mySubmissions.filter(s =>
      s.studentName.toLowerCase().includes(q) || s.event.toLowerCase().includes(q) || s.fileName.toLowerCase().includes(q)
    ).slice(0, 3).forEach(s => {
      out.push({
        id: s.id, type: 'submission',
        title: `${s.studentName} — ${typeLabel(s.submissionType)}`,
        subtitle: s.event,
        href: variant === 'officer' ? '/officer/submissions' : '/student/history',
      });
    });

    deadlines.filter(d => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)).slice(0, 2).forEach(d => {
      out.push({
        id: d.id, type: 'deadline',
        title: d.title,
        subtitle: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        href: variant === 'officer' ? '/officer/deadlines' : '/student/deadlines',
      });
    });

    meetings.filter(m => m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q)).slice(0, 2).forEach(m => {
      out.push({
        id: m.id, type: 'meeting',
        title: m.title,
        subtitle: `${m.location} · ${new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        href: variant === 'officer' ? '/officer/meetings' : '/student/meetings',
      });
    });

    return out;
  }, [query, variant, students, submissions, deadlines, meetings, currentStudent])();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (href: string) => {
    router.push(href);
    setQuery('');
    setOpen(false);
  };

  const typeIcon = (type: SearchResult['type']) => {
    const cls = 'w-3.5 h-3.5 shrink-0';
    if (type === 'member')     return <Users className={cls + ' text-indigo-500'} />;
    if (type === 'submission') return <FileText className={cls + ' text-blue-500'} />;
    if (type === 'deadline')   return <CalendarDays className={cls + ' text-amber-500'} />;
    return <CalendarCheck className={cls + ' text-teal-500'} />;
  };

  const typeLabel2 = (type: SearchResult['type']) =>
    ({ member: 'Member', submission: 'Submission', deadline: 'Deadline', meeting: 'Meeting' }[type]);

  const showDropdown = open && query.length >= 2;

  return (
    <header className="sticky top-3 z-40 mx-4 mb-2 shrink-0">
      <div
        className="h-12 flex items-center gap-3 px-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_8px_rgba(0,0,0,0.04)]"
        style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      >
        {/* Page title */}
        {pageTitle && (
          <>
            <span className="text-sm font-semibold text-gray-900 shrink-0 select-none">{pageTitle}</span>
            <div className="w-px h-4 bg-gray-200 shrink-0" />
          </>
        )}

        {/* Search */}
        <div ref={containerRef} className="relative flex-1">
          <div className={`flex items-center gap-2 transition-opacity duration-150 ${focused ? 'opacity-100' : 'opacity-60'}`}>
            <Search className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => { setOpen(true); setFocused(true); }}
              onBlur={() => setFocused(false)}
              placeholder="Search anything…"
              className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
            {!query && (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 shrink-0 text-[10px] text-gray-300 font-medium bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            )}
          </div>

          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.14 }}
                className="absolute top-full left-0 mt-3 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                {results.map((r, i) => (
                  <motion.button
                    key={`${r.id}-${i}`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleSelect(r.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    {typeIcon(r.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">
                      {typeLabel2(r.type)}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDropdown && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.14 }}
                className="absolute top-full left-0 mt-3 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-6 text-center"
              >
                <p className="text-sm text-gray-500">No results for &quot;{query}&quot;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification bell */}
        <div ref={notifRef} className="relative shrink-0">
          <button
            onClick={() => setNotifOpen(prev => !prev)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"
              />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600">{unreadCount}</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {myNotifs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications</div>
                  ) : (
                    myNotifs.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          href={n.href}
                          onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
