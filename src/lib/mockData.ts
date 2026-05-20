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
  // Season planning: deadlines scheduled between Nov 2026 and Apr 2027
  { id: 'd1', title: 'Draft 1 Submissions Due',            date: '2026-11-30T23:59:00Z', description: 'All members must submit their first draft. No extensions without prior approval.', forAll: true },
  { id: 'd2', title: 'Digital Portfolio Draft Due',        date: '2027-02-28T23:59:00Z', description: 'Submit the first draft of your digital portfolio (evidence, artifacts, and documentation).', forAll: true },
  { id: 'd3', title: 'Portfolio Final Deadline',           date: '2027-03-15T23:59:00Z', description: 'Final version of the digital portfolio due. Make sure all files and links are accessible.', forAll: true },
  { id: 'd4', title: 'State Competition Registration',     date: '2027-03-25T17:00:00Z', description: 'Final deadline to register all members for the NCTSA State Conference (Apr 9–11, 2027). No exceptions.', forAll: true },
  { id: 'd5', title: 'Final Submissions Deadline',         date: '2027-03-30T23:59:00Z', description: 'All final submissions must be uploaded to the portal before midnight. No late uploads accepted.', forAll: true },
  { id: 'd6', title: 'Presentation Rehearsal Session',     date: '2027-04-07T15:00:00Z', description: 'Full run-through of all presentation events. Officers will give timed feedback. Mandatory for all presentation members.', forAll: false },
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
  // Season meetings begin in September 2026 and run through the Spring 2027 competition season
  {
    id: 'meet1', title: 'Weekly Club Meeting',
    date: '2026-09-15T15:30:00Z', location: 'Room 204',
    description: 'General club meeting. Updates on competition prep, submission deadlines, and Q&A with officers.',
    appliesTo: 'all',
    rsvps: { s1: 'going', s2: 'going', s3: 'going', s5: 'going', s8: 'going', s9: 'not_going' },
  },
  {
    id: 'meet2', title: 'Product Event Workshop',
    date: '2026-10-10T16:00:00Z', location: 'Computer Lab B',
    description: 'Hands-on workshop for product event members. Bring your project files. Officer feedback session included.',
    appliesTo: 'category', category: 'product',
    rsvps: { s1: 'going', s2: 'going', s11: 'going', s4: 'not_going' },
  },
  {
    id: 'meet3', title: 'Digital Portfolio Kickoff',
    date: '2026-11-25T16:00:00Z', location: 'Library',
    description: 'Kickoff meeting for digital portfolios: scope, required artifacts, and timeline. Recommended for all participants preparing portfolios.',
    appliesTo: 'all',
    rsvps: { s1: 'going', s5: 'going', s8: 'going' },
  },
  {
    id: 'meet4', title: 'Presentation Rehearsal',
    date: '2027-04-07T15:00:00Z', location: 'Auditorium A',
    description: 'Full run-through of all presentation events. Officers will give timed feedback. Mandatory for presentation members.',
    appliesTo: 'category', category: 'presentation',
    rsvps: { s5: 'going', s6: 'going', s12: 'going' },
  },
  {
    id: 'meet5', title: 'Pre-State Send-Off',
    date: '2027-04-08T17:00:00Z', location: 'Cafeteria',
    description: 'Final team meeting before State competition. Travel logistics, last-minute Q&A, and a good luck celebration.',
    appliesTo: 'all',
    rsvps: { s1: 'going', s5: 'going', s8: 'going', s3: 'going' },
  },
];

export const DEFAULT_SETTINGS: ClubSettings = {
  clubName: 'Marvin Ridge TSA',
  schoolName: 'Marvin Ridge High School',
  advisorName: 'Mr. Stinson',
  // State competition date updated to NCTSA State Conference (Apr 9–11, 2027)
  competitionDate: '2027-04-09',
  requiredSubmissions: { draft1: true, draft2: true, final: true, supporting: false },
  notifications: { emailReminders: true, deadlineAlerts: true },
};

export const EVENTS = {
  product:      ['Software Development', 'Robotics', 'Computer Aided Design', 'Architectural Design'],
  presentation: ['Biotechnology Design', 'Engineering Design', 'Prepared Speech'],
  testing:      ['Data Science', 'Computer Science', 'Technology Problem Solving'],
};

export const ALL_EVENTS = [...EVENTS.product, ...EVENTS.presentation, ...EVENTS.testing];

export const EVENT_REFERENCE_TEXT = `The portal supports these TSA events:
- Animatronics: Create an animatronic device with sound, lights, and a display environment to communicate an idea, entertain, or demonstrate a concept.
- Architectural Design: Develop architectural plans and both physical and computer-generated models, then present and interview as a semifinalist.
- Audio Podcasting: Produce an original theme-based podcast with storytelling, voice acting, sound effects, and documentation; semifinalists are interviewed.
- Biotechnology Design: Research a biotechnology problem, develop a solution, create a display and multimedia presentation, and present/interview.
- Board Game Design: Design, build, and package a board game with creative instructions, pieces, and cards; semifinalists demonstrate gameplay and process.
- Chapter Team: Take a parliamentary procedure test, then semifinalists conduct opening ceremony, business items, parliamentary actions, and closing ceremony.
- Children\'s Stories: Create an illustrated children\'s story and development documentation; semifinalists read aloud and answer interview questions.
- Coding: Qualify with a coding test, then semifinalists develop a software program that addresses an onsite problem.
- Computer-Aided Design (CAD), Architecture: Use CAD skills to create architectural drawings such as plans, elevations, or ornamentation details; solutions are evaluated with an interview.
- Computer-Aided Design (CAD), Engineering: Use CAD skills to develop 3D engineering representations of machine parts, tools, or products; solutions are evaluated with an interview.
- Data Science and Analytics: Identify a societal issue, compile data, produce documentation and a digital poster, then create a synopsis and visualization for semifinals.
- Debating Technological Issues: Research a technology topic, prepare pro/con debate support materials and references, and compete against another chapter.
- Digital Video Production: Submit a digital video and documentation portfolio; semifinalists participate in an interview.
- Dragster Design: Design, draw, and construct a CO2-powered dragster, then compete in a race and interview.
- Drone Challenge (UAV): Design, build, document, and test fly an open-source UAV with portfolio materials and an interview.
- Engineering Design: Solve a grand challenge from the National Academy of Engineering with documentation, display, and prototype, then present/interview.
- Extemporaneous Speech: Prepare a 3-5 minute speech on a TSA or technology topic from topic cards; advancement depends on speech quality.
- Fashion Design and Technology: Create a wearable garment and documentation portfolio; semifinalists present their design and discuss the process.
- Flight Endurance: Design, build, and trim a rubber-band powered model aircraft for long endurance flights, with documentation, inspection, and timed flights.
- Forensic Science: Qualify with a forensic science test, then semifinalists analyze a mock crime scene and produce a written report.
- Future Technology Teacher: Research developing technology, create a classroom application video and lesson plan, and demonstrate the lesson while answering questions.
- Geospatial Technology: Interpret geospatial data, create a digital portfolio with maps and documentation, then defend projections and infographics.
- Manufacturing Prototype: Use CIM to design and fabricate a product, submit documentation, and deliver a sales pitch and demonstration.
- Music Production: Produce an original musical piece reflecting the theme, submit documentation, and advance based on quality.
- On Demand Video: Receive challenge criteria at conference, then produce a 60-second film within 36 hours that showcases video skills.
- Photographic Technology: Create a photographic portfolio based on the theme, complete onsite portfolio work, and advance based on portfolio quality and interview.
- Prepared Presentation: Deliver a 3-5 minute presentation on the theme with a slide deck; advancement is based on presentation quality.
- Promotional Design: Produce a promotional resource packet with printed materials and documentation; semifinalists demonstrate publishing competency.
- Robotics: Design, build, document, and test a robot built from open-source parts to meet theme specifications.
- Senior Solar Sprint: Design, build, and race a solar-powered vehicle carrying a payload, with documentation of the process.
- Software Development: Design, implement, test, document, and present a software project of educational or social value.
- STEM Mass Media: Create an annual theme news story in video and written formats, demonstrating journalism and communication skills.
- Structural Design and Engineering: Design and build a structure to challenge specifications, then evaluate efficiency with destructive testing.
- System Control Technology: Solve an onsite industrial problem with a computer-controlled mechanical model, program it, and demonstrate operation.
- Technology Bowl: Demonstrate TSA and technology knowledge through an objective test, then compete in a team question/response format.
- Technology Problem Solving: Design and build a solution to a 90-minute onsite problem, evaluated on performance measures such as time or strength.
- Transportation Modeling: Design a scale vehicle model with a display and documentation portfolio, then describe the vehicle and production process in interview.
- Video Game Design: Design, build, and launch an E-rated online video game with documentation, then interview about the development.
- Virtual Reality Simulation (VR): Create a 2-3 minute VR visualization with supporting documentation, present the visualization, and participate in an interview.
- Webmaster: Design, build, and launch a website addressing the challenge, then interview on the knowledge gained.`;
