'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { TrendingUp, Users, CheckCircle, AlertTriangle, Award } from 'lucide-react';
import { STUDENTS, EVENTS } from '@/lib/mockData';
import { EventCategory } from '@/lib/types';

type RequiredType = 'draft1' | 'draft2' | 'final';
const REQUIRED: RequiredType[] = ['draft1', 'draft2', 'final'];

function getMemberProgress(studentId: string, submissions: ReturnType<typeof useApp>['submissions'], required: string[]) {
  const submitted = submissions.filter(s => s.studentId === studentId).map(s => s.submissionType);
  const count = required.filter(t => submitted.includes(t as RequiredType)).length;
  return Math.round((count / required.length) * 100);
}

const CAT_COLORS: Record<EventCategory, string> = {
  product: '#3b82f6',
  presentation: '#8b5cf6',
  testing: '#14b8a6',
};

export default function AnalyticsPage() {
  const { submissions, settings } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const required = REQUIRED.filter(t => settings.requiredSubmissions[t]);

  const memberProgress = useMemo(() =>
    STUDENTS.map(s => getMemberProgress(s.id, submissions, required)),
    [submissions, required]
  );

  const avgProgress = Math.round(memberProgress.reduce((a, b) => a + b, 0) / memberProgress.length);
  const avgSubmissions = (submissions.length / STUDENTS.length).toFixed(1);
  const daysUntilStates = Math.max(0, Math.ceil((new Date(settings.competitionDate).getTime() - Date.now()) / 86400000));
  const reviewedPct = submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'reviewed').length / submissions.length) * 100) : 0;

  const progressBuckets = [
    { label: '0%',   count: memberProgress.filter(p => p === 0).length },
    { label: '33%',  count: memberProgress.filter(p => p > 0 && p <= 33).length },
    { label: '66%',  count: memberProgress.filter(p => p > 33 && p <= 66).length },
    { label: '100%', count: memberProgress.filter(p => p === 100).length },
  ];
  const maxBucket = Math.max(...progressBuckets.map(b => b.count), 1);

  const catData = [
    { name: 'Product',      value: submissions.filter(s => s.eventCategory === 'product').length,      color: CAT_COLORS.product },
    { name: 'Presentation', value: submissions.filter(s => s.eventCategory === 'presentation').length, color: CAT_COLORS.presentation },
    { name: 'Testing',      value: submissions.filter(s => s.eventCategory === 'testing').length,      color: CAT_COLORS.testing },
  ];
  const totalSubs = catData.reduce((a, b) => a + b.value, 0);

  const timeSeriesData = useMemo(() => {
    const start = new Date('2026-05-01');
    const end = new Date('2026-05-19');
    const data: { date: string; submissions: number }[] = [];
    let cumulative = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().split('T')[0];
      cumulative += submissions.filter(s => s.submittedAt.startsWith(dayStr)).length;
      data.push({ date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), submissions: cumulative });
    }
    return data;
  }, [submissions]);

  const eventBehind = useMemo(() => {
    const allEvents = [...EVENTS.product, ...EVENTS.presentation, ...EVENTS.testing];
    return allEvents.map(event => {
      const members = STUDENTS.filter(s => s.event === event);
      const cat = members[0]?.eventCategory ?? 'product';
      const progresses = members.map(s => getMemberProgress(s.id, submissions, required));
      const avg = progresses.length > 0 ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length) : 0;
      return { event, cat, memberCount: members.length, avg };
    }).sort((a, b) => a.avg - b.avg);
  }, [submissions, required]);

  const maxLine = Math.max(...timeSeriesData.map(d => d.submissions), 1);
  const chartH = 160;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Club progress and submission metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Club Readiness',         value: `${avgProgress}%`, color: 'text-indigo-700', accent: 'border-l-indigo-400', sub: 'avg member progress' },
          { label: 'Reviewed Rate',          value: `${reviewedPct}%`, color: 'text-green-700',  accent: 'border-l-green-500',  sub: 'of submissions reviewed' },
          { label: 'Avg Submissions/Member', value: avgSubmissions,    color: 'text-blue-700',   accent: 'border-l-blue-400',   sub: 'across all members' },
          { label: 'Days Until States',      value: daysUntilStates,   color: 'text-amber-600',  accent: 'border-l-amber-400',  sub: settings.competitionDate },
        ].map(card => (
          <div key={card.label} className={`bg-white rounded-xl px-5 py-4 border-l-[3px] ${card.accent}`}>
            <span className="block text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#999' }}>
              {card.label}
            </span>
            <p className={`text-4xl font-bold leading-none ${card.color}`}>{card.value}</p>
            <p className="text-xs mt-2" style={{ color: '#aaa' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart — Submissions Over Time */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Submission Activity</h2>
            <span className="text-xs text-gray-400 ml-auto">May 1 – May 19</span>
          </div>
          {!mounted ? (
            <div className="h-40 bg-gray-50 rounded animate-pulse" />
          ) : (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400 pr-2 w-6">
                <span>{maxLine}</span>
                <span>{Math.round(maxLine / 2)}</span>
                <span>0</span>
              </div>
              <div className="ml-8">
                <svg width="100%" height={chartH + 24} viewBox={`0 0 ${timeSeriesData.length * 20} ${chartH + 24}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 0.25, 0.5, 0.75, 1].map(p => (
                    <line key={p} x1="0" y1={chartH * p} x2={timeSeriesData.length * 20} y2={chartH * p}
                      stroke="#f3f4f6" strokeWidth="1" />
                  ))}
                  <polyline
                    fill="url(#lineGrad)"
                    stroke="none"
                    points={[
                      ...timeSeriesData.map((d, i) => `${i * 20 + 10},${chartH - (d.submissions / maxLine) * chartH}`),
                      `${(timeSeriesData.length - 1) * 20 + 10},${chartH}`,
                      `10,${chartH}`,
                    ].join(' ')}
                  />
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    points={timeSeriesData.map((d, i) =>
                      `${i * 20 + 10},${chartH - (d.submissions / maxLine) * chartH}`
                    ).join(' ')}
                  />
                  {timeSeriesData.map((d, i) => (
                    <circle key={i} cx={i * 20 + 10} cy={chartH - (d.submissions / maxLine) * chartH}
                      r="2.5" fill="#6366f1" />
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{timeSeriesData[0]?.date}</span>
                  <span>{timeSeriesData[Math.floor(timeSeriesData.length / 2)]?.date}</span>
                  <span>{timeSeriesData[timeSeriesData.length - 1]?.date}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie Chart — By Category */}
        <div className="bg-white border border-[#EEECE8] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">By Event Category</h2>
          {!mounted ? (
            <div className="h-40 bg-gray-50 rounded animate-pulse" />
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {(() => {
                    let offset = 0;
                    const r = 50, cx = 70, cy = 70, circumference = 2 * Math.PI * r;
                    return catData.map(seg => {
                      const pct = totalSubs > 0 ? seg.value / totalSubs : 0;
                      const dash = pct * circumference;
                      const gap = circumference - dash;
                      const rotation = offset * 360 - 90;
                      offset += pct;
                      return (
                        <circle key={seg.name} cx={cx} cy={cy} r={r} fill="none"
                          stroke={seg.color} strokeWidth="28"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset={0}
                          transform={`rotate(${rotation} ${cx} ${cy})`} />
                      );
                    });
                  })()}
                  <text x="70" y="68" textAnchor="middle" className="text-sm" fontSize="18" fontWeight="600" fill="#111827">{totalSubs}</text>
                  <text x="70" y="82" textAnchor="middle" fontSize="9" fill="#6b7280">total</text>
                </svg>
              </div>
              <div className="space-y-2">
                {catData.map(seg => (
                  <div key={seg.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                      <span className="text-xs text-gray-600">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-900">{seg.value}</span>
                      <span className="text-xs text-gray-400">({totalSubs > 0 ? Math.round(seg.value / totalSubs * 100) : 0}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Progress Distribution */}
        <div className="bg-white border border-[#EEECE8] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Member Progress Distribution</h2>
          </div>
          {!mounted ? (
            <div className="h-36 bg-gray-50 rounded animate-pulse" />
          ) : (
            <div className="space-y-3">
              {progressBuckets.map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-8 shrink-0">{b.label}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-md flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${(b.count / maxBucket) * 100}%`, minWidth: b.count > 0 ? '2rem' : '0' }}
                    >
                      {b.count > 0 && <span className="text-xs font-semibold text-white">{b.count}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-16 shrink-0">{b.count} member{b.count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table — Events Most Behind */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EEE9]">
            <h2 className="text-sm font-bold text-gray-900">Events by Completion</h2>
            <p className="text-xs text-gray-500 mt-0.5">Sorted by most behind first</p>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2 font-semibold text-gray-500">Event</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-500">Members</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-500">Avg Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {eventBehind.map(row => {
                  const catColor =
                    row.cat === 'product' ? 'text-blue-600' :
                    row.cat === 'presentation' ? 'text-purple-600' : 'text-teal-600';
                  const barColor =
                    row.avg < 33 ? 'bg-red-400' :
                    row.avg < 66 ? 'bg-amber-400' : 'bg-green-400';
                  return (
                    <tr key={row.event} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-900 leading-tight">{row.event}</p>
                        <p className={`text-xs ${catColor} capitalize`}>{row.cat}</p>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">{row.memberCount}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${row.avg}%` }} />
                          </div>
                          <span className="font-medium text-gray-700">{row.avg}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
