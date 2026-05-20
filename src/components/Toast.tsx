'use client';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '@/lib/AppContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium min-w-72 ${
            toast.type === 'success' ? 'bg-white border-green-200 text-green-800' :
            toast.type === 'error'   ? 'bg-white border-red-200 text-red-800' :
                                       'bg-white border-blue-200 text-blue-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
          {toast.type === 'error'   && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          {toast.type === 'info'    && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
