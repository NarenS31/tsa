'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { Upload, FileText, ChevronLeft, X } from 'lucide-react';
import { SubmissionType } from '@/lib/types';

const SUBMISSION_TYPES: { value: SubmissionType; label: string; desc: string }[] = [
  { value: 'draft1', label: 'Draft 1', desc: 'First draft for initial officer review' },
  { value: 'draft2', label: 'Draft 2', desc: 'Revised draft incorporating feedback' },
  { value: 'final', label: 'Final Submission', desc: 'Competition-ready final version' },
  { value: 'supporting', label: 'Supporting Documents', desc: 'Additional materials, references, etc.' },
];

export default function SubmitPage() {
  const { currentStudent, addSubmission, showToast } = useApp();
  const router = useRouter();

  const [submissionType, setSubmissionType] = useState<SubmissionType>('draft1');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!currentStudent) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    addSubmission({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      event: currentStudent.event,
      eventCategory: currentStudent.eventCategory,
      submissionType,
      status: 'pending',
      notes,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    });
    showToast('Submission received! Officers will review it soon.', 'success');
    setSubmitting(false);
    router.push('/student');
  };

  const catColor =
    currentStudent.eventCategory === 'product' ? 'text-blue-600 bg-blue-50 border-blue-200' :
    currentStudent.eventCategory === 'presentation' ? 'text-purple-600 bg-purple-50 border-purple-200' :
    'text-teal-600 bg-teal-50 border-teal-200';

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/student" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Submit Work</h1>
      <p className="text-sm text-gray-500 mb-8">Upload your materials for officer review.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
            <div className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {currentStudent.name}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Event</label>
            <div className={`px-3 py-2.5 rounded-lg border text-sm font-medium ${catColor}`}>
              {currentStudent.event}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Submission Type</label>
          <div className="grid grid-cols-2 gap-2">
            {SUBMISSION_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSubmissionType(type.value)}
                className={`text-left px-3 py-3 rounded-lg border transition-colors ${
                  submissionType === type.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <p className="text-sm font-medium">{type.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Describe what you're submitting, any questions for officers, or changes from the previous version..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">File Upload</label>
          {file ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-indigo-200 bg-indigo-50">
              <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">Any file type up to 50MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
          <Link
            href="/student"
            className="px-6 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
