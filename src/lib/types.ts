export type EventCategory = 'product' | 'presentation' | 'testing';
export type SubmissionStatus = 'pending' | 'reviewed' | 'needs_revision' | 'missing';
export type SubmissionType = 'draft1' | 'draft2' | 'final' | 'supporting';
export type UserType = 'student' | 'officer';
export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface Student {
  id: string;
  name: string;
  email: string;
  event: string;
  eventCategory: EventCategory;
  grade: number;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  event: string;
  eventCategory: EventCategory;
  submissionType: SubmissionType;
  status: SubmissionStatus;
  notes: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  feedback?: string;
  version: number;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  event?: string;
  eventCategory?: EventCategory;
  description: string;
  forAll: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Conversation {
  id: string;
  title: string;
  type: 'individual' | 'group';
  targetStudentId?: string;
  targetCategory?: EventCategory;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  appliesTo: 'all' | 'category' | 'specific';
  category?: EventCategory;
  studentIds?: string[];
  rsvps: Record<string, 'going' | 'not_going'>;
  attendance?: Record<string, AttendanceStatus>;
}

export interface ClubSettings {
  clubName: string;
  schoolName: string;
  advisorName: string;
  competitionDate: string;
  requiredSubmissions: Record<SubmissionType, boolean>;
  notifications: {
    emailReminders: boolean;
    deadlineAlerts: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'feedback' | 'deadline' | 'meeting' | 'submission' | 'attendance';
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
  forUserId: string; // student id or 'officer'
}

export interface RubricCriterion {
  label: string;
  score: number;
  maxScore: number;
  comment?: string;
}

export interface RubricScore {
  id: string;
  submissionId: string;
  studentId: string;
  criteria: RubricCriterion[];
  totalScore: number;
  maxScore: number;
  gradedBy: string;
  gradedAt: string;
}
