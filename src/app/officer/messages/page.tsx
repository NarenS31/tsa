'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { STUDENTS } from '@/lib/mockData';
import { Send, Plus, X, Users, User, ChevronDown } from 'lucide-react';
import { EventCategory } from '@/lib/types';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

export default function OfficerMessagesPage() {
  const { conversations, messages, createConversation, sendMessage } = useApp();
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id ?? '');
  const [input, setInput] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'individual' | 'group'>('group');
  const [newStudentId, setNewStudentId] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory | 'all'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find(c => c.id === selectedId);
  const threadMessages = messages.filter(m => m.conversationId === selectedId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const lastMessage = (convId: string) => {
    const msgs = messages.filter(m => m.conversationId === convId);
    return msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const convTitle = (c: typeof conversations[0]) => {
    if (c.type === 'individual' && c.targetStudentId) {
      return STUDENTS.find(s => s.id === c.targetStudentId)?.name ?? c.title;
    }
    return c.title;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length, selectedId]);

  const handleSend = () => {
    if (!input.trim() || !selectedId) return;
    sendMessage({ conversationId: selectedId, senderId: 'officer', senderName: 'Officer Park', content: input.trim() });
    setInput('');
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const id = createConversation({
      title: newTitle,
      type: newType,
      targetStudentId: newType === 'individual' ? newStudentId : undefined,
      targetCategory: newType === 'group' && newCategory !== 'all' ? newCategory as EventCategory : undefined,
    });
    setSelectedId(id);
    setShowNew(false);
    setNewTitle(''); setNewStudentId(''); setNewCategory('all');
  };

  const sortedConvs = [...conversations].sort((a, b) => {
    const la = lastMessage(a.id);
    const lb = lastMessage(b.id);
    if (!la && !lb) return 0;
    if (!la) return 1;
    if (!lb) return -1;
    return new Date(lb.timestamp).getTime() - new Date(la.timestamp).getTime();
  });

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Messages</h2>
          <button onClick={() => setShowNew(true)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedConvs.map(conv => {
            const last = lastMessage(conv.id);
            const isSelected = conv.id === selectedId;
            return (
              <button key={conv.id} onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  {conv.type === 'individual' ? <User className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                  <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{convTitle(conv)}</p>
                </div>
                {last && (
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-500 truncate flex-1">{last.senderName}: {last.content}</p>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">{formatTime(last.timestamp)}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        {selected ? (
          <>
            <div className="px-6 py-3.5 bg-white border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                {selected.type === 'individual' ? <User className="w-4 h-4 text-gray-400" /> : <Users className="w-4 h-4 text-gray-400" />}
                <h3 className="text-sm font-semibold text-gray-900">{convTitle(selected)}</h3>
                {selected.targetCategory && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selected.targetCategory === 'product' ? 'bg-blue-50 text-blue-700' :
                    selected.targetCategory === 'presentation' ? 'bg-purple-50 text-purple-700' :
                    'bg-teal-50 text-teal-700'}`}>
                    {selected.targetCategory}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {threadMessages.map(msg => {
                const isOfficer = msg.senderId === 'officer';
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isOfficer ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isOfficer ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {isOfficer ? 'OP' : initials(msg.senderName)}
                    </div>
                    <div className={`max-w-sm ${isOfficer ? 'items-end' : 'items-start'} flex flex-col`}>
                      <span className="text-xs text-gray-400 mb-1 px-1">{msg.senderName} · {formatTime(msg.timestamp)}</span>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isOfficer ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="px-6 py-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-3 items-end">
                <textarea
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Write a message…"
                  rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">Select a conversation</p>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">New Conversation</h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Product Event Demo Prep"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Recipients</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['group', 'individual'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setNewType(t)}
                      className={`py-2 rounded-lg border text-sm font-medium transition-colors ${newType === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {t === 'group' ? 'Group' : 'Individual'}
                    </button>
                  ))}
                </div>
              </div>
              {newType === 'group' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Event Category</label>
                  <div className="relative">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value as EventCategory | 'all')}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="all">All Members</option>
                      <option value="product">Product Events</option>
                      <option value="presentation">Presentation Events</option>
                      <option value="testing">Testing Events</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
              {newType === 'individual' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Student</label>
                  <div className="relative">
                    <select value={newStudentId} onChange={e => setNewStudentId(e.target.value)}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">Select a student</option>
                      {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name} — {s.event}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={handleCreate} disabled={!newTitle.trim() || (newType === 'individual' && !newStudentId)}
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  Create Conversation
                </button>
                <button onClick={() => setShowNew(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
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
