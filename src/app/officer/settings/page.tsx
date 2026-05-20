'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Building, User, CalendarDays, Bell, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { SubmissionType } from '@/lib/types';

const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  draft1:     'Draft 1',
  draft2:     'Draft 2',
  final:      'Final Submission',
  supporting: 'Supporting Documents',
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
        <div className="text-gray-400">{icon}</div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <label className="text-sm font-medium text-gray-700 col-span-1">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData, showToast } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowResetModal(false);
    showToast('All demo data has been reset.', 'success');
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage club configuration and preferences.</p>
      </div>

      <div className="space-y-5">
        {/* Club Info */}
        <Section title="Club Information" icon={<Building className="w-4 h-4" />}>
          <Field label="Club Name">
            <input value={settings.clubName}
              onChange={e => updateSettings({ clubName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="School Name">
            <input value={settings.schoolName}
              onChange={e => updateSettings({ schoolName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="Advisor Name">
            <input value={settings.advisorName}
              onChange={e => updateSettings({ advisorName: e.target.value })}
              className={inputCls} />
          </Field>
          <Field label="Competition Date">
            <input type="date" value={settings.competitionDate}
              onChange={e => updateSettings({ competitionDate: e.target.value })}
              className={inputCls} />
          </Field>
          <div className="pt-1">
            <button
              onClick={() => showToast('Club information saved.', 'success')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        </Section>

        {/* Submission Requirements */}
        <Section title="Submission Requirements" icon={<CheckCircle className="w-4 h-4" />}>
          <p className="text-xs text-gray-500 -mt-1">Toggle which submission types are required for all members. This affects progress calculations throughout the portal.</p>
          {(Object.keys(SUBMISSION_TYPE_LABELS) as SubmissionType[]).map(type => (
            <div key={type} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-900">{SUBMISSION_TYPE_LABELS[type]}</p>
                <p className="text-xs text-gray-500">
                  {type === 'supporting' ? 'Optional additional materials' : `Required ${type.replace('draft', 'Draft ')} review stage`}
                </p>
              </div>
              <Toggle
                checked={settings.requiredSubmissions[type]}
                onChange={val => updateSettings({ requiredSubmissions: { ...settings.requiredSubmissions, [type]: val } })}
              />
            </div>
          ))}
        </Section>

        {/* Notification Preferences */}
        <Section title="Notification Preferences" icon={<Bell className="w-4 h-4" />}>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Reminders</p>
              <p className="text-xs text-gray-500">Send automatic email reminders before deadlines</p>
            </div>
            <Toggle
              checked={settings.notifications.emailReminders}
              onChange={val => updateSettings({ notifications: { ...settings.notifications, emailReminders: val } })}
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900">Deadline Alerts</p>
              <p className="text-xs text-gray-500">In-portal alerts when a deadline is within 48 hours</p>
            </div>
            <Toggle
              checked={settings.notifications.deadlineAlerts}
              onChange={val => updateSettings({ notifications: { ...settings.notifications, deadlineAlerts: val } })}
            />
          </div>
        </Section>

        {/* Danger Zone */}
        <div className="bg-white border border-red-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-100">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Reset Demo Data</p>
                <p className="text-xs text-gray-500 mt-0.5">Restore all submissions, messages, meetings, and deadlines to their original mock state.</p>
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                className="ml-4 shrink-0 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-base font-semibold text-gray-900">Reset Demo Data?</h2>
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-5">
                This will restore all submissions, messages, meetings, and deadlines to the original demo state. Your settings changes will be preserved. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={handleReset}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Yes, Reset Everything
                </button>
                <button onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
