import { Student, Submission, Deadline, Conversation, Message, Meeting, ClubSettings } from './types';

export const STUDENTS: Student[] = [
  { id: 's1',  name: 'Alex Chen',       email: 'alex.chen@school.edu',    event: 'Software Development',       eventCategory: 'product',      grade: 11 },
  { id: 's2',  name: 'Maya Patel',      email: 'maya.patel@school.edu',   event: 'Robotics',                   eventCategory: 'product',      grade: 10 },
  { id: 's3',  name: 'Jordan Kim',      email: 'jordan.kim@school.edu',   event: 'Computer Aided Design',      eventCategory: 'product',      grade: 12 },
  { id: 's4',  name: 'Sam Williams',    email: 'sam.williams@school.edu', event: 'Architectural Design',       eventCategory: 'product',      grade: 11 },
  { id: 's5',  name: 'Taylor Johnson',  email: 'taylor.j@school.edu',     event: 'Biotechnology Design',       eventCategory: 'presentation', grade: 12 },
  { id: 's6',  name: 'Morgan Davis',    email: 'morgan.davis@school.edu', event: 'Engineering Design',         eventCategory: 'presentation', grade: 10 },
  { id: 's7',  name: 'Casey Brown',     email: 'casey.brown@school.edu',  event: 'Prepared Speech',            eventCategory: 'presentation', grade: 11 },
  { id: 's8',  name: 'Riley Thompson',  email: 'riley.t@school.edu',      event: 'Data Science',               eventCategory: 'testing',      grade: 12 },
  { id: 's9',  name: 'Drew Martinez',   email: 'drew.m@school.edu',       event: 'Computer Science',           eventCategory: 'testing',      grade: 11 },
  { id: 's10', name: 'Quinn Anderson',  email: 'quinn.a@school.edu',      event: 'Technology Problem Solving', eventCategory: 'testing',      grade: 10 },
  { id: 's11', name: 'Avery Wilson',    email: 'avery.w@school.edu',      event: 'Software Development',       eventCategory: 'product',      grade: 12 },
  { id: 's12', name: 'Blake Garcia',    email: 'blake.g@school.edu',      event: 'Biotechnology Design',       eventCategory: 'presentation', grade: 11 },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  { id: 'sub1',  studentId: 's1',  studentName: 'Alex Chen',      event: 'Software Development',       eventCategory: 'product',      submissionType: 'draft1',    status: 'reviewed',       notes: 'Initial prototype with core functionality implemented.', fileName: 'alex_chen_sw_draft1.zip',    fileSize: '2.4 MB', submittedAt: '2026-05-01T10:00:00Z', feedback: 'Great start! The UI is clean. Add more error handling for edge cases before draft 2.', version: 1, reviewedAt: '2026-05-03T14:00:00Z', reviewedBy: 'Officer Park' },
  { id: 'sub2',  studentId: 's1',  studentName: 'Alex Chen',      event: 'Software Development',       eventCategory: 'product',      submissionType: 'draft2',    status: 'pending',        notes: 'Fixed bugs from draft 1 feedback, added error handling and input validation.', fileName: 'alex_chen_sw_draft2.zip', fileSize: '3.1 MB', submittedAt: '2026-05-10T09:30:00Z', version: 2 },
  { id: 'sub3',  studentId: 's2',  studentName: 'Maya Patel',     event: 'Robotics',                   eventCategory: 'product',      submissionType: 'draft1',    status: 'needs_revision', notes: 'CAD files and initial build photos included.', fileName: 'maya_robotics_draft1.pdf', fileSize: '8.7 MB', submittedAt: '2026-05-02T11:00:00Z', feedback: 'The arm mechanism needs redesign. Current torque calculations are insufficient for the required load at full extension.', version: 1, reviewedAt: '2026-05-04T10:00:00Z', reviewedBy: 'Officer Park' },
  { id: 'sub4',  studentId: 's3',  studentName: 'Jordan Kim',     event: 'Computer Aided Design',      eventCategory: 'product',      submissionType: 'final',     status: 'reviewed',       notes: 'Final CAD drawings with all dimensions and material specs.', fileName: 'jordan_cad_final.dwg', fileSize: '15.2 MB', submittedAt: '2026-05-05T15:00:00Z', feedback: 'Excellent work! Dimensions are precise and the documentation is thorough. Ready for competition.', version: 1, reviewedAt: '2026-05-07T11:00:00Z', reviewedBy: 'Officer Chen' },
  { id: 'sub5',  studentId: 's4',  studentName: 'Sam Williams',   event: 'Architectural Design',       eventCategory: 'product',      submissionType: 'draft2',    status: 'pending',        notes: 'Updated floor plans based on structural feedback. Added cross-sections.', fileName: 'sam_arch_draft2.pdf', fileSize: '5.3 MB', submittedAt: '2026-05-12T08:00:00Z', version: 2 },
  { id: 'sub6',  studentId: 's5',  studentName: 'Taylor Johnson', event: 'Biotechnology Design',       eventCategory: 'presentation', submissionType: 'draft1',    status: 'reviewed',       notes: 'Research paper draft with full methodology section.', fileName: 'taylor_bio_draft1.docx', fileSize: '1.2 MB', submittedAt: '2026-05-03T13:00:00Z', feedback: 'Strong methodology section. Expand the literature review and add more recent citations (2023–2025).', version: 1, reviewedAt: '2026-05-05T16:00:00Z', reviewedBy: 'Officer Chen' },
  { id: 'sub7',  studentId: 's5',  studentName: 'Taylor Johnson', event: 'Biotechnology Design',       eventCategory: 'presentation', submissionType: 'draft2',    status: 'reviewed',       notes: 'Expanded literature review, added 8 new citations, revised conclusions.', fileName: 'taylor_bio_draft2.docx', fileSize: '1.8 MB', submittedAt: '2026-05-11T10:00:00Z', feedback: 'Much improved! Literature review is comprehensive now. Ready to move to final draft.', version: 2, reviewedAt: '2026-05-13T09:00:00Z', reviewedBy: 'Officer Park' },
  { id: 'sub8',  studentId: 's6',  studentName: 'Morgan Davis',   event: 'Engineering Design',         eventCategory: 'presentation', submissionType: 'draft1',    status: 'needs_revision', notes: 'Problem statement and three initial design concepts.', fileName: 'morgan_eng_draft1.pdf', fileSize: '3.5 MB', submittedAt: '2026-05-04T14:00:00Z', feedback: 'Problem statement is too vague. Define specific constraints and measurable success criteria. Resubmit within a week.', version: 1, reviewedAt: '2026-05-06T11:00:00Z', reviewedBy: 'Officer Park' },
  { id: 'sub9',  studentId: 's8',  studentName: 'Riley Thompson', event: 'Data Science',               eventCategory: 'testing',      submissionType: 'draft1',    status: 'reviewed',       notes: 'Jupyter notebook with EDA and initial model.', fileName: 'riley_ds_draft1.ipynb', fileSize: '4.2 MB', submittedAt: '2026-05-02T09:00:00Z', feedback: 'Good data exploration. Add more statistical significance tests and improve visualizations for clarity.', version: 1, reviewedAt: '2026-05-04T13:00:00Z', reviewedBy: 'Officer Lee' },
  { id: 'sub10', studentId: 's8',  studentName: 'Riley Thompson', event: 'Data Science',               eventCategory: 'testing',      submissionType: 'draft2',    status: 'pending',        notes: 'Added statistical analysis, improved visualizations, hyperparameter tuning.', fileName: 'riley_ds_draft2.ipynb', fileSize: '5.8 MB', submittedAt: '2026-05-14T11:00:00Z', version: 2 },
  { id: 'sub11', studentId: 's9',  studentName: 'Drew Martinez',  event: 'Computer Science',           eventCategory: 'testing',      submissionType: 'final',     status: 'pending',        notes: 'Algorithm implementation with time/space complexity analysis.', fileName: 'drew_cs_final.pdf', fileSize: '2.1 MB', submittedAt: '2026-05-15T16:00:00Z', version: 1 },
  { id: 'sub12', studentId: 's11', studentName: 'Avery Wilson',   event: 'Software Development',       eventCategory: 'product',      submissionType: 'draft1',    status: 'reviewed',       notes: 'Mobile app prototype with core screens implemented.', fileName: 'avery_sw_draft1.zip', fileSize: '7.3 MB', submittedAt: '2026-05-01T14:00:00Z', feedback: 'Solid prototype! Focus on performance optimization and accessibility in draft 2.', version: 1, reviewedAt: '2026-05-03T10:00:00Z', reviewedBy: 'Officer Lee' },
  { id: 'sub13', studentId: 's12', studentName: 'Blake Garcia',   event: 'Biotechnology Design',       eventCategory: 'presentation', submissionType: 'draft1',    status: 'needs_revision', notes: 'Initial experiment plan and hypothesis.', fileName: 'blake_bio_draft1.docx', fileSize: '0.9 MB', submittedAt: '2026-05-06T12:00:00Z', feedback: 'The hypothesis lacks a clear connection to the experimental design. Revise the hypothesis and align it with your methods section.', version: 1, reviewedAt: '2026-05-08T14:00:00Z', reviewedBy: 'Officer Chen' },
];

export const INITIAL_DEADLINES: Deadline[] = [
  { id: 'd1', title: 'Draft 1 Submissions Due',       date: '2026-05-25T23:59:00Z', description: 'All members must submit their first draft. No extensions without prior approval.', forAll: true },
  { id: 'd2', title: 'Software Development Demo Day', date: '2026-06-01T09:00:00Z', event: 'Software Development', eventCategory: 'product',      description: 'Live demo of software projects to the officer review panel. Laptops required.', forAll: false },
  { id: 'd3', title: 'Engineering Design Review',     date: '2026-06-05T14:00:00Z', event: 'Engineering Design',   eventCategory: 'presentation', description: 'Scheduled review session with officer feedback on engineering design presentations.', forAll: false },
  { id: 'd4', title: 'State Competition Registration',date: '2026-06-10T17:00:00Z', description: 'Final deadline to register all members for state competition. Absolutely no exceptions.', forAll: true },
  { id: 'd5', title: 'Final Submissions Deadline',    date: '2026-06-15T23:59:00Z', description: 'All final submissions must be uploaded to the portal before midnight.', forAll: true },
  { id: 'd6', title: 'Presentation Rehearsal Session',date: '2026-06-08T15:00:00Z', description: 'Mandatory rehearsal for all presentation event members. Room 204.', forAll: false },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: 'conv1', title: 'Product Event Updates',       type: 'group',      targetCategory: 'product',      createdAt: '2026-05-08T10:00:00Z' },
  { id: 'conv2', title: 'Biotech Design Check-In',     type: 'individual', targetStudentId: 's5',          createdAt: '2026-05-10T14:00:00Z' },
  { id: 'conv3', title: 'Testing Event Prep',           type: 'group',      targetCategory: 'testing',      createdAt: '2026-05-12T09:00:00Z' },
  { id: 'conv4', title: 'All Members Announcement',    type: 'group',                                       createdAt: '2026-05-05T11:00:00Z' },
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm1',  conversationId: 'conv4', senderId: 'officer',  senderName: 'Officer Park',    content: 'Hey everyone! Just a reminder that Draft 1 submissions are due May 25th. Please make sure everything is uploaded on time.', timestamp: '2026-05-05T11:00:00Z' },
  { id: 'm2',  conversationId: 'conv4', senderId: 's1',       senderName: 'Alex Chen',       content: 'Got it, thanks for the reminder!', timestamp: '2026-05-05T11:05:00Z' },
  { id: 'm3',  conversationId: 'conv4', senderId: 's5',       senderName: 'Taylor Johnson',  content: 'Will do! Quick question — does the file size limit apply to the zip archive or individual files?', timestamp: '2026-05-05T11:08:00Z' },
  { id: 'm4',  conversationId: 'conv4', senderId: 'officer',  senderName: 'Officer Park',    content: 'Total upload size per submission. Keep it under 50MB and you\'re good.', timestamp: '2026-05-05T11:12:00Z' },
  { id: 'm5',  conversationId: 'conv1', senderId: 'officer',  senderName: 'Officer Park',    content: 'Product event members — demo day is June 1st. Please have your projects ready for a 5-minute live demo in Room 301.', timestamp: '2026-05-08T10:00:00Z' },
  { id: 'm6',  conversationId: 'conv1', senderId: 's2',       senderName: 'Maya Patel',      content: 'What format should the demo be in? Slides + live demo or just live demo?', timestamp: '2026-05-08T10:30:00Z' },
  { id: 'm7',  conversationId: 'conv1', senderId: 'officer',  senderName: 'Officer Park',    content: 'Live demo preferred. Slides optional but keep them to 2-3 max if you use them.', timestamp: '2026-05-08T10:45:00Z' },
  { id: 'm8',  conversationId: 'conv1', senderId: 's1',       senderName: 'Alex Chen',       content: 'Got it. Will there be a projector and HDMI in Room 301?', timestamp: '2026-05-08T11:00:00Z' },
  { id: 'm9',  conversationId: 'conv1', senderId: 'officer',  senderName: 'Officer Park',    content: 'Yes — projector and HDMI available. Bring your own adapters just in case.', timestamp: '2026-05-08T11:05:00Z' },
  { id: 'm10', conversationId: 'conv2', senderId: 'officer',  senderName: 'Officer Chen',    content: 'Hi Taylor! I reviewed your draft 2 — it looks really strong. One thing: can you clarify the statistical significance of your results in Section 4?', timestamp: '2026-05-10T14:00:00Z' },
  { id: 'm11', conversationId: 'conv2', senderId: 's5',       senderName: 'Taylor Johnson',  content: 'Thanks! Yes I can add a p-value table there. Should I use ANOVA or a t-test given the multiple groups?', timestamp: '2026-05-10T14:30:00Z' },
  { id: 'm12', conversationId: 'conv2', senderId: 'officer',  senderName: 'Officer Chen',    content: 'ANOVA would be more appropriate since you have multiple groups. Great instinct! Also add effect size (Cohen\'s d) if you can.', timestamp: '2026-05-10T14:35:00Z' },
  { id: 'm13', conversationId: 'conv2', senderId: 's5',       senderName: 'Taylor Johnson',  content: 'Perfect, I\'ll have the updated section to you by end of week.', timestamp: '2026-05-10T14:40:00Z' },
  { id: 'm14', conversationId: 'conv3', senderId: 'officer',  senderName: 'Officer Lee',     content: 'Testing event members — organizing a study session June 11th at 4pm in the Library Study Room 3. Are you all available?', timestamp: '2026-05-12T09:00:00Z' },
  { id: 'm15', conversationId: 'conv3', senderId: 's8',       senderName: 'Riley Thompson',  content: 'Yes, that works for me! What topics will we cover?', timestamp: '2026-05-12T09:15:00Z' },
  { id: 'm16', conversationId: 'conv3', senderId: 's9',       senderName: 'Drew Martinez',   content: 'I can make it. Hoping to review graph algorithms and dynamic programming.', timestamp: '2026-05-12T09:20:00Z' },
  { id: 'm17', conversationId: 'conv3', senderId: 'officer',  senderName: 'Officer Lee',     content: 'Exactly that — algorithms, data structures, and past TSA test walkthroughs. I\'ll share a study guide by June 8th.', timestamp: '2026-05-12T09:30:00Z' },
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet1', title: 'Weekly Club Meeting',
    date: '2026-05-28T15:30:00Z', location: 'Room 204',
    description: 'General club meeting. Updates on competition prep, submission deadlines, and Q&A with officers.',
    appliesTo: 'all',
    rsvps: { s1: 'going', s2: 'going', s3: 'going', s5: 'going', s8: 'going', s9: 'not_going' },
  },
  {
    id: 'meet2', title: 'Product Event Workshop',
    date: '2026-06-03T16:00:00Z', location: 'Computer Lab B',
    description: 'Hands-on workshop for product event members. Bring your project files. Officer feedback session included.',
    appliesTo: 'category', category: 'product',
    rsvps: { s1: 'going', s2: 'going', s11: 'going', s4: 'not_going' },
  },
  {
    id: 'meet3', title: 'Presentation Rehearsal',
    date: '2026-06-08T15:00:00Z', location: 'Auditorium A',
    description: 'Full run-through of all presentation events. Officers will give timed feedback. Mandatory for all presentation members.',
    appliesTo: 'category', category: 'presentation',
    rsvps: { s5: 'going', s6: 'going', s7: 'not_going', s12: 'going' },
  },
  {
    id: 'meet4', title: 'Testing Event Study Session',
    date: '2026-06-11T16:00:00Z', location: 'Library Study Room 3',
    description: 'Practice problems, algorithm review, and past TSA test walkthroughs. Study guide shared in advance.',
    appliesTo: 'category', category: 'testing',
    rsvps: { s8: 'going', s9: 'going', s10: 'not_going' },
  },
  {
    id: 'meet5', title: 'Pre-State Send-Off',
    date: '2026-06-19T17:00:00Z', location: 'Cafeteria',
    description: 'Final team meeting before State competition. Travel logistics, last-minute Q&A, and a good luck celebration.',
    appliesTo: 'all',
    rsvps: { s1: 'going', s5: 'going', s8: 'going', s3: 'going' },
  },
];

export const DEFAULT_SETTINGS: ClubSettings = {
  clubName: 'Marvin Ridge TSA',
  schoolName: 'Marvin Ridge High School',
  advisorName: 'Mr. Stinson',
  competitionDate: '2027-04-18',
  requiredSubmissions: { draft1: true, draft2: true, final: true, supporting: false },
  notifications: { emailReminders: true, deadlineAlerts: true },
};

export const EVENTS = {
  product:      ['Software Development', 'Robotics', 'Computer Aided Design', 'Architectural Design'],
  presentation: ['Biotechnology Design', 'Engineering Design', 'Prepared Speech'],
  testing:      ['Data Science', 'Computer Science', 'Technology Problem Solving'],
};

export const ALL_EVENTS = [...EVENTS.product, ...EVENTS.presentation, ...EVENTS.testing];
