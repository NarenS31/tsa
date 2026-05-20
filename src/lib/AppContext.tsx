'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Student, Submission, Deadline, ToastMessage, UserType, Conversation, Message, Meeting, ClubSettings } from './types';
import {
  STUDENTS, INITIAL_SUBMISSIONS, INITIAL_DEADLINES,
  INITIAL_CONVERSATIONS, INITIAL_MESSAGES, INITIAL_MEETINGS, DEFAULT_SETTINGS,
} from './mockData';

interface AppContextValue {
  userType: UserType | null;
  currentStudent: Student | null;
  students: Student[];
  submissions: Submission[];
  deadlines: Deadline[];
  conversations: Conversation[];
  messages: Message[];
  meetings: Meeting[];
  settings: ClubSettings;
  toasts: ToastMessage[];
  login: (type: UserType, studentId?: string) => void;
  logout: () => void;
  addSubmission: (sub: Omit<Submission, 'id' | 'version' | 'submittedAt'>) => void;
  updateSubmissionStatus: (id: string, status: Submission['status'], feedback?: string) => void;
  addFeedback: (submissionId: string, feedback: string) => void;
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
  createConversation: (conv: Omit<Conversation, 'id' | 'createdAt'>) => string;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'rsvps'>) => void;
  rsvpMeeting: (meetingId: string, studentId: string, status: 'going' | 'not_going') => void;
  updateSettings: (patch: Partial<ClubSettings>) => void;
  resetAllData: () => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [students] = useState<Student[]>(STUDENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [settings, setSettings] = useState<ClubSettings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = useCallback((type: UserType, studentId?: string) => {
    setUserType(type);
    if (type === 'student' && studentId) {
      setCurrentStudent(STUDENTS.find(s => s.id === studentId) ?? null);
    } else {
      setCurrentStudent(null);
    }
  }, []);

  const logout = useCallback(() => {
    setUserType(null);
    setCurrentStudent(null);
  }, []);

  const addSubmission = useCallback((sub: Omit<Submission, 'id' | 'version' | 'submittedAt'>) => {
    setSubmissions(prev => {
      const existingVersions = prev.filter(s => s.studentId === sub.studentId && s.submissionType === sub.submissionType);
      const newSub: Submission = { ...sub, id: `sub${Date.now()}`, version: existingVersions.length + 1, submittedAt: new Date().toISOString() };
      return [newSub, ...prev];
    });
  }, []);

  const updateSubmissionStatus = useCallback((id: string, status: Submission['status'], feedback?: string) => {
    setSubmissions(prev => prev.map(s =>
      s.id === id ? { ...s, status, feedback: feedback ?? s.feedback, reviewedAt: new Date().toISOString(), reviewedBy: 'Officer Park' } : s
    ));
  }, []);

  const addFeedback = useCallback((submissionId: string, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, feedback } : s));
  }, []);

  const addDeadline = useCallback((deadline: Omit<Deadline, 'id'>) => {
    const newDeadline: Deadline = { ...deadline, id: `d${Date.now()}` };
    setDeadlines(prev => [...prev, newDeadline].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const createConversation = useCallback((conv: Omit<Conversation, 'id' | 'createdAt'>): string => {
    const id = `conv${Date.now()}`;
    setConversations(prev => [...prev, { ...conv, id, createdAt: new Date().toISOString() }]);
    return id;
  }, []);

  const sendMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: `m${Date.now()}`, timestamp: new Date().toISOString() }]);
  }, []);

  const addMeeting = useCallback((meeting: Omit<Meeting, 'id' | 'rsvps'>) => {
    const newMeeting: Meeting = { ...meeting, id: `meet${Date.now()}`, rsvps: {} };
    setMeetings(prev => [...prev, newMeeting].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const rsvpMeeting = useCallback((meetingId: string, studentId: string, status: 'going' | 'not_going') => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId ? { ...m, rsvps: { ...m.rsvps, [studentId]: status } } : m
    ));
  }, []);

  const updateSettings = useCallback((patch: Partial<ClubSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const resetAllData = useCallback(() => {
    setSubmissions(INITIAL_SUBMISSIONS);
    setDeadlines(INITIAL_DEADLINES);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setMeetings(INITIAL_MEETINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <AppContext.Provider value={{
      userType, currentStudent, students, submissions, deadlines,
      conversations, messages, meetings, settings, toasts,
      login, logout, addSubmission, updateSubmissionStatus, addFeedback,
      addDeadline, createConversation, sendMessage, addMeeting, rsvpMeeting,
      updateSettings, resetAllData, showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
