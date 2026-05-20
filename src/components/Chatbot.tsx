'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const { userType, currentStudent, submissions, deadlines, settings } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildSystemPrompt = () => {
    const mySubmissions = userType === 'student' && currentStudent
      ? submissions.filter(s => s.studentId === currentStudent.id)
      : submissions;

    const role = userType === 'officer'
      ? 'a TSA club officer'
      : `a TSA club student named ${currentStudent?.name} competing in ${currentStudent?.event} (Grade ${currentStudent?.grade})`;

    return `You are a helpful assistant for the ${settings.clubName} TSA (Technology Student Association) portal at ${settings.schoolName}. The faculty advisor is ${settings.advisorName}. The state competition date is ${new Date(settings.competitionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

The current user is ${role}.

${userType === 'student' && currentStudent ? `Student submission status: ${mySubmissions.length} submission(s) on record.
Submissions: ${mySubmissions.map(s => `${s.submissionType} (${s.status})`).join(', ') || 'none yet'}` : `Total club submissions: ${submissions.length}`}

Upcoming deadlines:
${deadlines.slice(0, 6).map(d => `- ${d.title}: ${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`).join('\n')}

Help users with TSA-related questions: submission deadlines, event requirements, competition preparation, club logistics, and portal navigation. Be friendly, concise, and encouraging. Keep answers brief and to the point.`;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const errMsg = (errBody as { error?: { message?: string } })?.error?.message ?? `HTTP ${response.status}`;
        console.error('Anthropic API error:', response.status, errBody);
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errMsg}` }]);
        return;
      }
      const data = await response.json();
      const text = data.content?.[0]?.text ?? 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error('Chatbot fetch error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error — check your connection and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ width: 380, height: 500 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0" style={{ background: '#0F0F0F' }}>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">TSA Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#F7F6F3' }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 pb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">TSA Assistant</p>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                  Ask me about deadlines, events, submissions, or competition prep.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about TSA..."
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-colors"
        aria-label="Toggle TSA Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </>
  );
}
