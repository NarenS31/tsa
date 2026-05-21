'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, Clock, CalendarDays, Users, FileCheck,
  LogOut, MessageSquare, BarChart2, Settings, CalendarCheck, PanelLeft, BookOpen,
} from 'lucide-react';

interface NavItem { href: string; label: string; icon: React.ReactNode }

const STUDENT_NAV: NavItem[] = [
  { href: '/student',           label: 'Dashboard',  icon: <LayoutDashboard size={17} /> },
  { href: '/student/submit',    label: 'Submit Work', icon: <Upload size={17} /> },
  { href: '/student/history',   label: 'History',     icon: <Clock size={17} /> },
  { href: '/student/deadlines', label: 'Deadlines',   icon: <CalendarDays size={17} /> },
  { href: '/student/meetings',   label: 'Meetings',    icon: <CalendarCheck size={17} /> },
  { href: '/student/messages',   label: 'Messages',    icon: <MessageSquare size={17} /> },
  { href: '/student/resources',  label: 'Resources',   icon: <BookOpen size={17} /> },
];

const OFFICER_NAV: NavItem[] = [
  { href: '/officer',              label: 'Dashboard',   icon: <LayoutDashboard size={17} /> },
  { href: '/officer/submissions',  label: 'Submissions', icon: <FileCheck size={17} /> },
  { href: '/officer/members',      label: 'Members',     icon: <Users size={17} /> },
  { href: '/officer/deadlines',    label: 'Deadlines',   icon: <CalendarDays size={17} /> },
  { href: '/officer/meetings',     label: 'Meetings',    icon: <CalendarCheck size={17} /> },
  { href: '/officer/analytics',    label: 'Analytics',   icon: <BarChart2 size={17} /> },
  { href: '/officer/messages',     label: 'Messages',    icon: <MessageSquare size={17} /> },
  { href: '/officer/resources',    label: 'Resources',   icon: <BookOpen size={17} /> },
  { href: '/officer/settings',     label: 'Settings',    icon: <Settings size={17} /> },
];

function Tooltip({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -4 }}
      transition={{ duration: 0.1 }}
      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none z-50"
    >
      <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
        {label}
        <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
      </div>
    </motion.div>
  );
}

export default function Sidebar({ variant }: { variant: 'student' | 'officer' }) {
  const pathname = usePathname();
  const { logout, currentStudent } = useApp();
  const router = useRouter();
  const nav = variant === 'student' ? STUDENT_NAV : OFFICER_NAV;
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => { logout(); router.push('/'); };

  const isActive = (href: string) =>
    href === '/student' || href === '/officer' ? pathname === href : pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      className="min-h-screen flex flex-col shrink-0 overflow-hidden"
      style={{ background: '#0F0F0F', borderRight: '1px solid #1c1c1c' }}
    >
      {/* ── Brand header ── */}
      <div
        className="flex items-center h-14 shrink-0 px-3"
        style={{ borderBottom: '1px solid #1c1c1c' }}
      >
        <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${collapsed ? 'justify-center' : ''}`}>
          <Image
            src="/mrlogo.png"
            alt="Marvin Ridge"
            width={30}
            height={30}
            className="rounded-full object-cover shrink-0"
          />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="min-w-0"
              >
                <span className="block text-[13px] font-semibold text-white tracking-tight truncate leading-tight">
                  TSA Portal
                </span>
                <span className="block text-[11px] truncate leading-tight" style={{ color: '#555' }}>
                  Marvin Ridge HS
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setCollapsed(true)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#444' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}
            >
              <PanelLeft size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Expand button when collapsed ── */}
      <AnimatePresence initial={false}>
        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-2 pt-2"
          >
            <button
              onClick={() => setCollapsed(false)}
              className="w-full h-8 flex items-center justify-center rounded-md transition-colors"
              style={{ color: '#444' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#aaa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#444'; }}
            >
              <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.2 }}>
                <PanelLeft size={14} />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {nav.map((item, i) => (
          <motion.div
            key={item.href}
            className="relative"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            onMouseEnter={() => collapsed && setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href={item.href}
              className={`flex items-center rounded-lg text-sm transition-colors duration-100 ${
                collapsed ? 'justify-center w-full h-9' : 'gap-3 px-3 h-9'
              } ${isActive(item.href) ? 'text-white' : 'hover:text-white'}`}
              style={
                isActive(item.href)
                  ? { background: '#1e1e1e', color: '#fff' }
                  : { color: '#555' }
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="truncate font-medium text-[13px]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <AnimatePresence>
              {collapsed && hoveredItem === item.href && (
                <Tooltip label={item.label} />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </nav>

      {/* ── User card ── */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="px-3 pb-2"
          >
            {variant === 'student' && currentStudent ? (
              <div className="px-3 py-2.5 rounded-lg" style={{ background: '#161616' }}>
                <p className="text-[12px] font-medium text-white truncate">{currentStudent.name}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: '#555' }}>{currentStudent.event}</p>
              </div>
            ) : variant === 'officer' ? (
              <div className="px-3 py-2.5 rounded-lg" style={{ background: '#161616' }}>
                <p className="text-[11px] font-medium uppercase tracking-wider mb-0.5" style={{ color: '#444' }}>Role</p>
                <p className="text-[13px] font-semibold text-white">Officer</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Log out ── */}
      <div
        className="py-3 px-2"
        style={{ borderTop: '1px solid #1c1c1c' }}
      >
        <div
          className="relative"
          onMouseEnter={() => collapsed && setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg text-sm transition-colors duration-100 w-full ${
              collapsed ? 'justify-center h-9' : 'gap-3 px-3 h-9'
            }`}
            style={{ color: '#555' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; }}
          >
            <span className="shrink-0"><LogOut size={17} /></span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="font-medium text-[13px]"
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <AnimatePresence>
            {collapsed && hoveredItem === 'logout' && <Tooltip label="Log Out" />}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
