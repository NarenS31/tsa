'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Upload, Clock, CalendarDays, Users, FileCheck,
  LogOut, MessageSquare, BarChart2, Settings, CalendarCheck,
} from 'lucide-react';

interface NavItem { href: string; label: string; icon: React.ReactNode }

const STUDENT_NAV: NavItem[] = [
  { href: '/student',           label: 'Dashboard',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/student/submit',    label: 'Submit Work',  icon: <Upload className="w-4 h-4" /> },
  { href: '/student/history',   label: 'History',      icon: <Clock className="w-4 h-4" /> },
  { href: '/student/deadlines', label: 'Deadlines',    icon: <CalendarDays className="w-4 h-4" /> },
  { href: '/student/meetings',  label: 'Meetings',     icon: <CalendarCheck className="w-4 h-4" /> },
  { href: '/student/messages',  label: 'Messages',     icon: <MessageSquare className="w-4 h-4" /> },
];

const OFFICER_NAV: NavItem[] = [
  { href: '/officer',              label: 'Dashboard',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/officer/submissions',  label: 'Submissions', icon: <FileCheck className="w-4 h-4" /> },
  { href: '/officer/members',      label: 'Members',     icon: <Users className="w-4 h-4" /> },
  { href: '/officer/deadlines',    label: 'Deadlines',   icon: <CalendarDays className="w-4 h-4" /> },
  { href: '/officer/meetings',     label: 'Meetings',    icon: <CalendarCheck className="w-4 h-4" /> },
  { href: '/officer/analytics',    label: 'Analytics',   icon: <BarChart2 className="w-4 h-4" /> },
  { href: '/officer/messages',     label: 'Messages',    icon: <MessageSquare className="w-4 h-4" /> },
  { href: '/officer/settings',     label: 'Settings',    icon: <Settings className="w-4 h-4" /> },
];

export default function Sidebar({ variant }: { variant: 'student' | 'officer' }) {
  const pathname = usePathname();
  const { logout, currentStudent } = useApp();
  const router = useRouter();
  const nav = variant === 'student' ? STUDENT_NAV : OFFICER_NAV;

  const handleLogout = () => { logout(); router.push('/'); };

  const isActive = (href: string) =>
    href === '/student' || href === '/officer' ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 min-h-screen flex flex-col shrink-0" style={{ background: '#0F0F0F' }}>
      <div className="px-4 py-5" style={{ borderBottom: '1px solid #232323' }}>
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white text-sm tracking-tight">TSA Portal</span>
        </div>
        <div className="mt-3.5">
          {variant === 'student' && currentStudent ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#555' }}>Logged in as</p>
              <p className="text-sm font-semibold text-white truncate mt-0.5">{currentStudent.name}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: '#666' }}>{currentStudent.event}</p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#555' }}>Role</p>
              <p className="text-sm font-semibold text-white mt-0.5">Officer</p>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-8 space-y-0.5">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              isActive(item.href)
                ? 'text-white font-medium'
                : 'font-normal hover:text-white'
            }`}
            style={isActive(item.href)
              ? { background: '#1f1f1f', color: '#fff' }
              : { color: '#777' }
            }
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-2 py-4" style={{ borderTop: '1px solid #1f1f1f' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors w-full hover:text-white"
          style={{ color: '#666' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
