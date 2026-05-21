'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { STUDENTS } from '@/lib/mockData';
import { Send, Users, User } from 'lucide-react';

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

export default function StudentMessagesPage() {
  const { currentStudent, conversations, messages, sendMessage } = useApp();
  const [selectedId, setSelectedId] = useState<string>('');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  if (!currentStudent) return null;

  const myConversations = conversations.filter(conv => {
    if (conv.type === 'individual') return conv.targetStudentId === currentStudent.id;
    if (conv.type === 'group' && conv.targetCategory) return conv.targetCategory === currentStudent.eventCategory;
    return true;
  });

  const lastMessage = (convId: string) => {
    const msgs = messages.filter(m => m.conversationId === convId);
    return msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const sortedConvs = [...myConversations].sort((a, b) => {
    const la = lastMessage(a.id);
    const lb = lastMessage(b.id);
    if (!la && !lb) return 0; if (!la) return 1; if (!lb) return -1;
    return new Date(lb.timestamp).getTime() - new Date(la.timestamp).getTime();
  });

  const effectiveSelectedId = selectedId || sortedConvs[0]?.id || '';
  const selected = conversations.find(c => c.id === effectiveSelectedId);
  const threadMessages = messages
    .filter(m => m.conversationId === effectiveSelectedId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length, effectiveSelectedId]);

  const convLabel = (c: typeof conversations[0]) => {
    if (c.type === 'individual') return 'Direct message with Officer';
    if (c.targetCategory) return `${c.targetCategory.charAt(0).toUpperCase() + c.targetCategory.slice(1)} Events`;
    return 'All Members';
  };

  const handleSend = () => {
    if (!input.trim() || !effectiveSelectedId) return;
    sendMessage({ conversationId: effectiveSelectedId, senderId: currentStudent.id, senderName: currentStudent.name, content: input.trim() });
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedConvs.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-6 text-center">No conversations yet.</p>
          ) : sortedConvs.map(conv => {
            const last = lastMessage(conv.id);
            const isSelected = conv.id === effectiveSelectedId;
            return (
              <button key={conv.id} onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  {conv.type === 'individual' ? <User className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                  <p className={`text-sm font-medium truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{conv.title}</p>
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

      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        {selected ? (
          <>
            <div className="px-6 py-3.5 bg-white border-b border-gray-100 shrink-0">
              <h3 className="text-sm font-semibold text-gray-900">{selected.title}</h3>
              <p className="text-xs text-gray-500">{convLabel(selected)}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {threadMessages.map(msg => {
                const isMe = msg.senderId === currentStudent.id;
                const isOfficer = msg.senderId === 'officer';
                const avatarBg = isMe ? 'bg-indigo-600 text-white' : isOfficer ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-600';
                const avatarInitials = isOfficer ? msg.senderName.split(' ').map(n => n[0]).join('') : initials(msg.senderName);
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarBg}`}>
                      {avatarInitials}
                    </div>
                    <div className={`max-w-sm flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs text-gray-400 mb-1 px-1">{msg.senderName} · {formatTime(msg.timestamp)}</span>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
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
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Write a message…" rows={1}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">No conversations available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
