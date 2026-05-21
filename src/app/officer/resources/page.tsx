'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { motion } from 'framer-motion';
import { BookOpen, FileText, ClipboardList, GraduationCap, Wrench, Download } from 'lucide-react';

const SECTIONS = [
  {
    id: 'rules',
    label: 'Rulebook & Competition',
    Icon: BookOpen,
    accent: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
    items: [
      { title: 'TSA National Competitive Events Guide', tag: 'PDF', description: 'Official rules, event parameters, and scoring rubrics for all competitive events at regional and national level.' },
      { title: 'NCTSA State Conference Handbook', tag: 'PDF', description: 'State-level competition details, schedule, registration deadlines, and NC-specific regulations.' },
      { title: 'Event Parameters Quick Reference', tag: 'Doc', description: 'Size, weight, submission format, and time constraints for every event category.' },
      { title: 'Chapter Membership Requirements', tag: 'PDF', description: 'Dues, eligibility, and chapter officer responsibilities per national TSA bylaws.' },
    ],
  },
  {
    id: 'rubrics',
    label: 'Scoring Rubrics',
    Icon: ClipboardList,
    accent: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700',
    items: [
      { title: 'Software Development Rubric', tag: 'PDF', description: 'Official judge scoring criteria covering functionality, design, documentation, and presentation.' },
      { title: 'Engineering Design Rubric', tag: 'PDF', description: 'Breakdown of design process documentation, prototype quality, and interview scoring.' },
      { title: 'Biotechnology Design Rubric', tag: 'PDF', description: 'Research methodology, experimental design, results analysis, and presentation criteria.' },
      { title: 'Data Science Rubric', tag: 'PDF', description: 'Criteria for problem framing, data handling, model quality, visualization, and written report.' },
    ],
  },
  {
    id: 'study',
    label: 'Study Guides & Prep',
    Icon: GraduationCap,
    accent: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700',
    items: [
      { title: 'Computer Science Study Guide', tag: 'Doc', description: 'Algorithms, data structures, Big-O notation, sorting, graphs, and dynamic programming with worked examples.' },
      { title: 'Data Science Study Guide', tag: 'Doc', description: 'Statistics fundamentals, ML concepts, Python/pandas, data visualization, and model evaluation metrics.' },
      { title: 'Technology Problem Solving Guide', tag: 'Doc', description: 'Common problem types, design-thinking frameworks, and walkthroughs of past TSA test questions.' },
      { title: 'Past Competition Test Bank', tag: 'Archive', description: 'Curated collection of past regional and state written test questions with answer keys.' },
    ],
  },
  {
    id: 'templates',
    label: 'Templates & Tools',
    Icon: Wrench,
    accent: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badgeClass: 'bg-teal-100 text-teal-700',
    items: [
      { title: 'Digital Portfolio Template', tag: 'Template', description: 'Required structure, cover page format, and artifact organization guidelines for TSA digital portfolios.' },
      { title: 'Engineering Notebook Template', tag: 'Template', description: 'Daily log format, design iteration pages, photo guidelines, and reflection prompts.' },
      { title: 'Project Documentation Checklist', tag: 'Checklist', description: 'Pre-submission checklist verifying your project meets all documentation and format requirements.' },
      { title: 'Presentation Slide Template', tag: 'Template', description: 'Branded slide deck starter with recommended sections and TSA competition best practices.' },
    ],
  },
];

export default function OfficerResourcesPage() {
  const { showToast } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Official TSA documents, rubrics, study guides, and templates for officers and members.</p>
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveSection(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSection === null ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          All
        </button>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSection === s.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <s.Icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {SECTIONS.filter(s => !activeSection || s.id === activeSection).map((section, si) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.08 + i * 0.05, duration: 0.25 }}
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
