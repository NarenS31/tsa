'use client';

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F7F6F3' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-semibold text-gray-900">TSA Portal</span>
        </div>

        <div className="border border-[#E0DDD8] rounded-xl bg-white p-8">
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
  );
}
