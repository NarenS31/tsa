'use client';

import { useApp } from '@/lib/AppContext';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ClipboardList, GraduationCap, Lightbulb, Download } from 'lucide-react';

const SECTIONS = [
  {
    id: 'rules',
    label: 'Event Rules & Parameters',
    Icon: BookOpen,
    accent: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
    items: [
      { title: 'TSA Competitive Events Guide', tag: 'PDF', description: 'Official rules and parameters for every TSA event. Bookmark this — judges score by it.' },
      { title: 'NCTSA State Conference Info', tag: 'PDF', description: 'NC-specific schedule, venue details, and what to expect at State competition.' },
      { title: 'Event Parameter Quick Sheet', tag: 'Doc', description: 'One-page summary of size limits, file formats, time limits, and submission requirements.' },
    ],
  },
  {
    id: 'rubrics',
    label: 'How You Will Be Scored',
    Icon: ClipboardList,
    accent: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700',
    items: [
      { title: 'Software Development Rubric', tag: 'PDF', description: 'See exactly how judges score your app: functionality, UX, code quality, and presentation.' },
      { title: 'Biotechnology Design Rubric', tag: 'PDF', description: 'Scoring breakdown for research quality, experimental design, and presentation delivery.' },
      { title: 'Engineering Design Rubric', tag: 'PDF', description: 'How your design process, prototype, and documentation are evaluated point-by-point.' },
      { title: 'Data Science Rubric', tag: 'PDF', description: 'Criteria for methodology, analysis rigor, visualizations, and written report quality.' },
    ],
  },
  {
    id: 'study',
    label: 'Study & Prep',
    Icon: GraduationCap,
    accent: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700',
    items: [
      { title: 'Computer Science Study Guide', tag: 'Doc', description: 'Algorithms, sorting, graphs, dynamic programming, and past test questions with solutions.' },
      { title: 'Data Science Study Guide', tag: 'Doc', description: 'Stats basics, ML concepts, Python/pandas cheatsheet, and model evaluation practice.' },
      { title: 'Technology Problem Solving Guide', tag: 'Doc', description: 'Design-thinking steps, brainstorming frameworks, and sample problems with walkthroughs.' },
      { title: 'Past Test Questions Archive', tag: 'Archive', description: 'Collection of past regional and state written test questions — great for practice runs.' },
    ],
  },
  {
    id: 'templates',
    label: 'Templates & Starters',
    Icon: Lightbulb,
    accent: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700',
    items: [
      { title: 'Digital Portfolio Template', tag: 'Template', description: 'Pre-structured portfolio with all required sections — just drop in your evidence and artifacts.' },
      { title: 'Engineering Notebook Template', tag: 'Template', description: 'Daily log pages, design iteration format, photo labels, and reflection prompts.' },
      { title: 'Project Documentation Checklist', tag: 'Checklist', description: 'Run through this before every submission to make sure nothing is missing.' },
    ],
  },
];

export default function StudentResourcesPage() {
  const { showToast, currentStudent } = useApp();

  const handleDownload = (title: string) => {
    showToast(`"${title}" download coming soon`, 'info');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50 px-6 py-10"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 ml-12">
          Everything you need for {currentStudent?.event ?? 'your event'} — rules, rubrics, study guides, and templates.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-7 h-7 rounded-lg ${section.iconBg} flex items-center justify-center`}>
                <section.Icon className={`w-3.5 h-3.5 ${section.iconColor}`} />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">{section.label}</h2>
              <span className="text-xs text-gray-400">{section.items.length} resources</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.08 + i * 0.06, duration: 0.25 }}
                  className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col gap-3 ${section.accent}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                      <FileText className={`w-4 h-4 ${section.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${section.badgeClass}`}>
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(item.title)}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
