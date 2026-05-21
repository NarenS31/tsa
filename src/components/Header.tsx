'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { Search, Users, FileText, CalendarDays, CalendarCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'member' | 'submission' | 'deadline' | 'meeting';
  title: string;
  subtitle: string;
  href: string;
}

export default function Header({ variant }: { variant: 'student' | 'officer' }) {
  const { students, submissions, deadlines, meetings, currentStudent } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
      <div className="h-12 flex items-center px-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm" style={{ border: '1px solid #ececec' }}>
      {/* Search — centered in the bar */}
      <div ref={containerRef} className="relative flex-1 flex justify-center">
        <div className={`flex items-center gap-2.5 w-full max-w-md transition-all duration-150 ${focused ? 'opacity-100' : 'opacity-80'}`}>
          <Search className="w-4 h-4 shrink-0" style={{ color: focused ? '#555' : '#aaa' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { setOpen(true); setFocused(true); }}
            onBlur={() => setFocused(false)}
            placeholder="Search…"
            className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.1 }}
                onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
          {!query && (
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-300 font-medium">
              <span>⌘</span><span>K</span>
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
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
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
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-6 text-center"
            >
              <p className="text-sm text-gray-500">No results for &quot;{query}&quot;</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </header>
  );
}
