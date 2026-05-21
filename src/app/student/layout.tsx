'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { currentStudent } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentStudent) router.replace('/');
  }, [currentStudent, router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar variant="student" />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header variant="student" />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
