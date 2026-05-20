'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { STUDENTS } from '@/lib/mockData';
import { GraduationCap, ChevronRight, X } from 'lucide-react';

export default function LandingPage() {
  const { login } = useApp();
  const router = useRouter();
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const handleOfficerLogin = () => {
    login('officer');
    router.push('/officer');
  };

  const handleStudentLogin = (studentId: string) => {
    login('student', studentId);
    router.push('/student');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: '#EFF3F8' }}>
      <div className="w-full max-w-lg">
        <div className="rounded-[2rem] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] border border-white/70 p-8 mb-10">
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="flex items-center justify-center rounded-3xl bg-slate-50 p-4 shadow-sm">
              <Image src="/mrlogo.png" alt="Marvin Ridge logo" width={72} height={72} className="rounded-2xl" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-600 mb-2">Marvin Ridge TSA</p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">Welcome to the TSA Portal</h1>
            </div>
            <p className="max-w-xl text-sm text-slate-500">
              Pick your role to sign in and manage TSA submissions, deadlines, meetings, and officer guidance.
            </p>
          </div>

          <div className="grid gap-3">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#888' }}>Select your role to continue to your dashboard.</p>

          <div className="space-y-3">
            <button
              onClick={() => setShowStudentPicker(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Student</p>
                <p className="text-xs text-gray-500 mt-0.5">View dashboard, submit work, track feedback</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={handleOfficerLogin}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Officer</p>
                <p className="text-xs text-gray-500 mt-0.5">Review submissions, manage members and deadlines</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#bbb' }}>
          Technology Student Association — Demo Portal
        </p>
      </div>

      {showStudentPicker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Choose your account</h2>
              <button onClick={() => setShowStudentPicker(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 max-h-[420px] overflow-y-auto">
              {STUDENTS.map(student => {
                const catColor =
                  student.eventCategory === 'product' ? 'text-blue-600' :
                  student.eventCategory === 'presentation' ? 'text-purple-600' :
                  'text-teal-600';
                return (
                  <button
                    key={student.id}
                    onClick={() => handleStudentLogin(student.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className={`text-xs ${catColor}`}>{student.event}</p>
                    </div>
                    <span className="text-xs text-gray-400">Grade {student.grade}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
