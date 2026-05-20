'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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
