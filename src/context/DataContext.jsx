import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getCurrentYear, getAcademicYear, generateRegisterNumber, generateTransactionId, generateAppRef } from '../utils/idGenerator';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_COURSES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_RESULTS,
  INITIAL_FEES,
  INITIAL_HELPDESK,
  INITIAL_AUDIT_LOGS,
  INITIAL_SUBJECTS,
  INITIAL_EXAMINATIONS,
  INITIAL_MARKS
} from '../data/initialMockData';
import {
  generateSubjectOfferings,
  generateFacultyAndAssignments
} from '../data/collegeDataGenerator';

const DataContext = createContext();

const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://collegemanagement-production.up.railway.app/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export const DataProvider = ({ children }) => {
  const [dbConnected, setDbConnected] = useState(false);

  // Safe load helper from localStorage
  const safeLoadStorage = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };

  // -------------------------------------------------------------
  // STATE INITIALIZATION WITH DETERMINISTIC REAL DATA
  // -------------------------------------------------------------
  const [users, setUsers] = useState(() => safeLoadStorage('kalpanaaa_data_users_v5', INITIAL_USERS));
  
  const [departments, setDepartments] = useState(() => safeLoadStorage('kalpanaaa_data_departments_v5', INITIAL_DEPARTMENTS));

  const [courses, setCourses] = useState(() => {
    const cached = safeLoadStorage('kalpanaaa_data_courses_v5', null);
    if (cached && Array.isArray(cached) && cached.length >= INITIAL_COURSES.length) return cached;
    return INITIAL_COURSES;
  });

  const [subjects, setSubjects] = useState(() => {
    const cached = safeLoadStorage('kalpanaaa_data_subjects_v5', null);
    if (cached && Array.isArray(cached) && cached.length >= INITIAL_SUBJECTS.length) return cached;
    return INITIAL_SUBJECTS;
  });

  const [subjectOfferings, setSubjectOfferings] = useState(() => {
    const cached = safeLoadStorage('kalpanaaa_data_subject_offerings_v5', null);
    if (cached && Array.isArray(cached) && cached.length >= INITIAL_SUBJECTS.length) return cached;
    return generateSubjectOfferings();
  });

  const [facultyClassAssignments, setFacultyClassAssignments] = useState(() => {
    const cached = safeLoadStorage('kalpanaaa_data_faculty_assignments_v5', null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return generateFacultyAndAssignments().assignments;
  });

  const [attendance, setAttendance] = useState(() => safeLoadStorage('kalpanaaa_data_attendance_v5', INITIAL_ATTENDANCE));

  const [teacherAttendance, setTeacherAttendance] = useState(() => {
    const cached = safeLoadStorage('kalpanaaa_data_teacher_attendance_v5', null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    const faculty = INITIAL_USERS.filter(u => u.role === 'TEACHER' || u.role === 'STAFF');
    const dates = ['2026-08-15', '2026-08-14', '2026-08-13'];
    const logs = [];
    faculty.forEach(t => {
      dates.forEach(date => {
        logs.push({
          id: `tatt-${t.id}-${date}`,
          teacherId: t.employeeId || t.id,
          teacherName: t.name,
          department: t.department || 'Computer Science and Engineering',
          designation: t.designation || 'Faculty Member',
          date: date,
          checkInTime: '08:45 AM',
          checkOutTime: '04:45 PM',
          status: 'Present',
          biometricMode: 'Biometric Smart Card',
          remarks: 'Regular Academic Duty'
        });
      });
    });
    return logs;
  });

  const [assignments, setAssignments] = useState(() => safeLoadStorage('kalpanaaa_data_assignments_v5', INITIAL_ASSIGNMENTS));

  const [examinations, setExaminations] = useState(() => safeLoadStorage('kalpanaaa_data_examinations_v5', INITIAL_EXAMINATIONS));

  const [marksRecords, setMarksRecords] = useState(() => safeLoadStorage('kalpanaaa_data_marks_v5', INITIAL_MARKS));

  const [results, setResults] = useState(() => safeLoadStorage('kalpanaaa_data_results_v5', INITIAL_RESULTS));

  const [fees, setFees] = useState(() => safeLoadStorage('kalpanaaa_data_fees_v5', INITIAL_FEES));

  const [leaveRequests, setLeaveRequests] = useState(() => safeLoadStorage('kalpanaaa_data_leave_v5', INITIAL_LEAVE_REQUESTS));

  const [helpdesk, setHelpdesk] = useState(() => safeLoadStorage('kalpanaaa_data_helpdesk_v5', INITIAL_HELPDESK));

  const [announcements, setAnnouncements] = useState(() => safeLoadStorage('kalpanaaa_data_announcements_v5', INITIAL_ANNOUNCEMENTS));

  const [news, setNews] = useState(() => safeLoadStorage('kalpanaaa_data_news_v5', INITIAL_NEWS));

  const [events, setEvents] = useState(() => safeLoadStorage('kalpanaaa_data_events_v5', INITIAL_EVENTS));

  const [admissionApplications, setAdmissionApplications] = useState(() => safeLoadStorage('kalpanaaa_data_admissions_v5', [
    {
      id: 'app-sample-1',
      app_ref: 'APP-2026-6026',
      full_name: 'Thabee',
      email: 'thabee@gmail.com',
      phone: '9080841727',
      dob: '2008-05-15',
      gender: 'Female',
      course: 'B.Tech Computer Science & Engineering',
      department: 'Computer Science & Engineering',
      prev_qualification: '12th Standard / Senior Secondary',
      prev_percentage: '88.5%',
      guardian_name: 'Suresh Patel',
      guardian_phone: '9812345678',
      doc_10th: '10th_marksheet_thabee.pdf',
      doc_12th: '12th_marksheet_thabee.pdf',
      doc_tc: 'transfer_certificate_thabee.pdf',
      status: 'Under Verification',
      created_at: new Date().toISOString()
    }
  ]));

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_admissions_v5', JSON.stringify(admissionApplications)); } catch (e) {}
  }, [admissionApplications]);

  const [notifications, setNotifications] = useState(() => {
    const saved = safeLoadStorage('kalpanaaa_data_notifications_v5', null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return [
      {
        id: "NOTIF-1",
        userId: "STU-2024-001",
        title: "Welcome to Kalpanaaa Student Portal",
        message: "Your profile and academic record for 6th Semester CSE is fully updated.",
        date: "2026-08-11",
        read: false
      },
      {
        id: "NOTIF-2",
        userId: "STU-2024-001",
        title: "Leave Request Approved",
        message: "Your leave request LV-2026-101 from 2026-08-14 to 2026-08-16 has been APPROVED by Management.",
        date: "2026-08-13",
        read: false
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState(() => safeLoadStorage('kalpanaaa_data_audit_v5', INITIAL_AUDIT_LOGS));

  // -------------------------------------------------------------
  // COMPLETE LOCAL STORAGE PERSISTENCE SYNC (EVERY STATE CHANGE)
  // -------------------------------------------------------------
  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_users_v5', JSON.stringify(users)); } catch (e) {}
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_departments_v5', JSON.stringify(departments)); } catch (e) {}
  }, [departments]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_courses_v5', JSON.stringify(courses)); } catch (e) {}
  }, [courses]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_subjects_v5', JSON.stringify(subjects)); } catch (e) {}
  }, [subjects]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_subject_offerings_v5', JSON.stringify(subjectOfferings)); } catch (e) {}
  }, [subjectOfferings]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_faculty_assignments_v5', JSON.stringify(facultyClassAssignments)); } catch (e) {}
  }, [facultyClassAssignments]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_attendance_v5', JSON.stringify(attendance)); } catch (e) {}
  }, [attendance]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_teacher_attendance_v5', JSON.stringify(teacherAttendance)); } catch (e) {}
  }, [teacherAttendance]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_assignments_v5', JSON.stringify(assignments)); } catch (e) {}
  }, [assignments]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_examinations_v5', JSON.stringify(examinations)); } catch (e) {}
  }, [examinations]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_marks_v5', JSON.stringify(marksRecords)); } catch (e) {}
  }, [marksRecords]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_results_v5', JSON.stringify(results)); } catch (e) {}
  }, [results]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_fees_v5', JSON.stringify(fees)); } catch (e) {}
  }, [fees]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_leave_v5', JSON.stringify(leaveRequests)); } catch (e) {}
  }, [leaveRequests]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_helpdesk_v5', JSON.stringify(helpdesk)); } catch (e) {}
  }, [helpdesk]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_announcements_v5', JSON.stringify(announcements)); } catch (e) {}
  }, [announcements]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_news_v5', JSON.stringify(news)); } catch (e) {}
  }, [news]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_events_v5', JSON.stringify(events)); } catch (e) {}
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_notifications_v5', JSON.stringify(notifications)); } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('kalpanaaa_data_audit_v5', JSON.stringify(auditLogs)); } catch (e) {}
  }, [auditLogs]);

  // -------------------------------------------------------------
  // LIVE MYSQL BACKEND SYNC & REAL-TIME SSE EVENT STREAM
  // -------------------------------------------------------------
  useEffect(() => {
    async function syncFromBackend() {
      try {
        const [stdRes, tchRes, subRes, dptRes, crsRes, hlpRes, annRes, levRes, fcaRes, exmRes, mrkRes, attRes, tAttRes, notifRes, adtRes, asnRes, feeRes] = await Promise.allSettled([
          fetch(`${API_BASE}/students`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/teachers`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/subjects`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/departments`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/courses`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/helpdesk`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/announcements`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/leave-requests`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/faculty-assignments`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/examinations`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/marks`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/attendance`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/teacher-attendance`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/notifications`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/audit-logs`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/assignments`).then(r => r.ok ? r.json() : Promise.reject(r.status)),
          fetch(`${API_BASE}/fees`).then(r => r.ok ? r.json() : Promise.reject(r.status))
        ]);

        const anyBackendSuccess = [stdRes, tchRes, subRes, dptRes, crsRes, hlpRes, annRes, levRes, fcaRes, exmRes, mrkRes, attRes, tAttRes, notifRes, adtRes, asnRes, feeRes].some(r => r.status === 'fulfilled');

        if (anyBackendSuccess) {
          setDbConnected(true);
        }

        if (stdRes.status === 'fulfilled' && Array.isArray(stdRes.value)) {
          const teachers = (tchRes.status === 'fulfilled' && Array.isArray(tchRes.value) ? tchRes.value : []).map(t => ({
            ...t,
            role: 'TEACHER',
            employeeId: t.employeeId || t.id,
            status: t.status || 'Active'
          }));
          const students = stdRes.value.map(s => ({
            ...s,
            role: 'STUDENT',
            studentId: s.studentId || s.id,
            status: s.status || 'Active'
          }));

          setUsers(prev => {
            const adminUsers = prev.filter(u => u.role === 'ADMIN');
            const fallbackAdmins = adminUsers.length > 0 ? adminUsers : INITIAL_USERS.filter(u => u.role === 'ADMIN');
            const facultyPool = teachers.length > 0 ? teachers : INITIAL_USERS.filter(u => u.role === 'TEACHER');
            return [...fallbackAdmins, ...facultyPool, ...students];
          });
        }
        if (attRes.status === 'fulfilled' && Array.isArray(attRes.value) && attRes.value.length > 0) {
          setAttendance(attRes.value);
        }
        if (tAttRes.status === 'fulfilled' && Array.isArray(tAttRes.value) && tAttRes.value.length > 0) {
          setTeacherAttendance(tAttRes.value);
        }
        if (asnRes.status === 'fulfilled' && Array.isArray(asnRes.value) && asnRes.value.length > 0) {
          setAssignments(asnRes.value);
        }
        if (feeRes.status === 'fulfilled' && Array.isArray(feeRes.value) && feeRes.value.length > 0) {
          setFees(feeRes.value);
        }
        if (exmRes.status === 'fulfilled' && Array.isArray(exmRes.value) && exmRes.value.length > 0) {
          setExaminations(exmRes.value);
        }
        if (mrkRes.status === 'fulfilled' && Array.isArray(mrkRes.value) && mrkRes.value.length > 0) {
          setMarksRecords(mrkRes.value);
        }
        if (fcaRes.status === 'fulfilled' && Array.isArray(fcaRes.value) && fcaRes.value.length > 0) {
          setFacultyClassAssignments(fcaRes.value);
        }
        if (subRes.status === 'fulfilled' && Array.isArray(subRes.value) && subRes.value.length > 0) {
          setSubjectOfferings(subRes.value);
          setSubjects(subRes.value);
        }
        if (dptRes.status === 'fulfilled' && Array.isArray(dptRes.value) && dptRes.value.length > 0) {
          setDepartments(dptRes.value);
        }
        if (crsRes.status === 'fulfilled' && Array.isArray(crsRes.value) && crsRes.value.length > 0) {
          setCourses(crsRes.value);
        }
        if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value) && notifRes.value.length > 0) {
          setNotifications(notifRes.value);
        }
        if (adtRes.status === 'fulfilled' && Array.isArray(adtRes.value) && adtRes.value.length > 0) {
          setAuditLogs(adtRes.value);
        }
        if (hlpRes.status === 'fulfilled' && Array.isArray(hlpRes.value) && hlpRes.value.length > 0) {
          const normalizedTickets = hlpRes.value.map(r => {
            let responses = [];
            try {
              responses = Array.isArray(r.responses) ? r.responses : (typeof r.replies === 'string' ? JSON.parse(r.replies) : (r.replies || []));
            } catch (e) {}
            const isStaff = r.applicantRole === 'STAFF' || r.source === 'STAFF' || (r.staffId && String(r.staffId).startsWith('EMP')) || (r.applicantId && String(r.applicantId).startsWith('EMP'));
            const applicantName = r.applicantName || r.studentName || r.staffName || (isStaff ? 'Faculty Member' : 'Enrolled Student');
            const applicantId = r.applicantId || r.studentId || r.staffId || 'STU-2024-001';
            const applicantRole = r.applicantRole || r.source || (isStaff ? 'STAFF' : 'STUDENT');
            const targetRole = r.targetRole || (r.targetDesk?.toLowerCase().includes('staff') ? 'STAFF' : 'ADMIN');
            const createdAt = r.createdAt || r.date || (r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

            return {
              ...r,
              applicantName,
              applicantId,
              applicantRole,
              targetRole,
              createdAt,
              responses,
              status: (r.status === 'In Progress' || responses.length > 0) ? 'Responded' : (r.status || 'Open')
            };
          });
          setHelpdesk(normalizedTickets);
        }
        if (annRes.status === 'fulfilled' && Array.isArray(annRes.value) && annRes.value.length > 0) {
          setAnnouncements(annRes.value);
        }
        if (levRes.status === 'fulfilled' && Array.isArray(levRes.value) && levRes.value.length > 0) {
          setLeaveRequests(levRes.value);
        }
      } catch (err) {
        console.warn('Backend offline, using persistent local dataset.');
      }
    }

    syncFromBackend();

    let eventSource;
    try {
      eventSource = new EventSource(`${API_BASE}/events`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ATTENDANCE_MARKED') {
            fetch(`${API_BASE}/attendance`).then(r => r.json()).then(att => { if (Array.isArray(att)) setAttendance(att); }).catch(() => {});
          } else if (data.type === 'HELPDESK_TICKET_SUBMITTED' || data.type === 'HELPDESK_REPLY_POSTED') {
            fetch(`${API_BASE}/helpdesk`).then(r => r.json()).then(hlp => {
              if (Array.isArray(hlp)) {
                const normalized = hlp.map(r => {
                  let responses = [];
                  try {
                    responses = Array.isArray(r.responses) ? r.responses : (typeof r.replies === 'string' ? JSON.parse(r.replies) : (r.replies || []));
                  } catch (e) {}
                  const isStaff = r.applicantRole === 'STAFF' || r.source === 'STAFF' || (r.staffId && String(r.staffId).startsWith('EMP')) || (r.applicantId && String(r.applicantId).startsWith('EMP'));
                  return {
                    ...r,
                    applicantName: r.applicantName || r.studentName || r.staffName || (isStaff ? 'Faculty Member' : 'Enrolled Student'),
                    applicantId: r.applicantId || r.studentId || r.staffId || 'STU-2024-001',
                    applicantRole: r.applicantRole || r.source || (isStaff ? 'STAFF' : 'STUDENT'),
                    targetRole: r.targetRole || (r.targetDesk?.toLowerCase().includes('staff') ? 'STAFF' : 'ADMIN'),
                    createdAt: r.createdAt || r.date || (r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
                    responses,
                    status: (r.status === 'In Progress' || responses.length > 0) ? 'Responded' : (r.status || 'Open')
                  };
                });
                setHelpdesk(normalized);
              }
            }).catch(() => {});
          } else if (data.type === 'FACULTY_CLASS_ASSIGNED' || data.type === 'FACULTY_CLASS_UNASSIGNED') {
            fetch(`${API_BASE}/faculty-assignments`).then(r => r.json()).then(fca => { if (Array.isArray(fca)) setFacultyClassAssignments(fca); }).catch(() => {});
          } else if (data.type === 'ANNOUNCEMENT_BROADCAST') {
            fetch(`${API_BASE}/announcements`).then(r => r.json()).then(ann => { if (Array.isArray(ann)) setAnnouncements(ann); }).catch(() => {});
          } else if (data.type === 'LEAVE_REQUEST_SUBMITTED' || data.type === 'LEAVE_STATUS_UPDATED') {
            fetch(`${API_BASE}/leave-requests`).then(r => r.json()).then(lev => { if (Array.isArray(lev)) setLeaveRequests(lev); }).catch(() => {});
          } else if (data.type === 'ASSIGNMENT_CREATED' || data.type === 'ASSIGNMENT_UPDATED' || data.type === 'ASSIGNMENT_DELETED' || data.type === 'ASSIGNMENT_SUBMITTED' || data.type === 'ASSIGNMENT_GRADED') {
            fetch(`${API_BASE}/assignments`).then(r => r.json()).then(asn => { if (Array.isArray(asn)) setAssignments(asn); }).catch(() => {});
          } else if (data.type === 'NOTIFICATION_RECEIVED') {
            fetch(`${API_BASE}/notifications`).then(r => r.json()).then(notifs => { if (Array.isArray(notifs)) setNotifications(notifs); }).catch(() => {});
          } else if (data.type === 'FEE_PAYMENT_RECORDED') {
            fetch(`${API_BASE}/fees`).then(r => r.json()).then(feesData => { if (Array.isArray(feesData)) setFees(feesData); }).catch(() => {});
            fetch(`${API_BASE}/students`).then(r => r.json()).then(stus => {
              if (Array.isArray(stus)) {
                setUsers(prev => prev.map(u => {
                  const m = stus.find(s => s.id === u.id || s.studentId === u.studentId);
                  return m ? { ...u, ...m } : u;
                }));
              }
            }).catch(() => {});
          } else if (data.type === 'USER_PROFILE_UPDATED') {
            fetch(`${API_BASE}/students`).then(r => r.json()).then(stus => {
              if (Array.isArray(stus)) {
                setUsers(prev => prev.map(u => {
                  const m = stus.find(s => s.id === u.id || s.studentId === u.studentId);
                  return m ? { ...u, ...m } : u;
                }));
              }
            }).catch(() => {});
          }
        } catch (e) {
          console.warn('Real-time event processing issue:', e);
        }
      };

      eventSource.onerror = () => {
        // Quietly handle stream resets; browser EventSource automatically reconnects
      };
    } catch (e) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // -------------------------------------------------------------
  // NOTIFICATION & AUDIT HELPERS
  // -------------------------------------------------------------
  const dispatchNotification = (userId, title, message) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    try {
      fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, message })
      }).catch(() => {});
    } catch (e) {}
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    try {
      fetch(`${API_BASE}/notifications/${notifId}/read`, { method: 'PUT' }).catch(() => {});
    } catch (e) {}
  };

  const markAllNotificationsAsRead = (currUser) => {
    setNotifications(prev => prev.map(n => {
      if (!currUser) return { ...n, read: true };
      const matches = 
        n.userId === currUser.id ||
        n.userId === currUser.studentId ||
        n.userId === currUser.employeeId ||
        n.userId === currUser.email ||
        (currUser.role === 'ADMIN' && (n.userId === 'ADMIN' || n.userId === 'ALL_ADMINS' || n.userId === 'ALL' || n.userId === 'ALL_USERS')) ||
        ((currUser.role === 'TEACHER' || currUser.role === 'STAFF') && (n.userId === 'TEACHER' || n.userId === 'STAFF' || n.userId === 'ALL_TEACHERS' || n.userId === 'ALL' || n.userId === 'ALL_USERS')) ||
        (currUser.role === 'STUDENT' && (n.userId === 'STUDENT' || n.userId === 'ALL_STUDENTS' || n.userId === 'ALL' || n.userId === 'ALL_USERS'));
      
      return matches ? { ...n, read: true } : n;
    }));

    try {
      fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currUser?.id || currUser?.studentId || currUser?.employeeId, userRole: currUser?.role })
      }).catch(() => {});
    } catch (e) {}
  };

  const clearNotifications = (currUser) => {
    setNotifications(prev => prev.filter(n => {
      if (!currUser) return false;
      const matches = 
        n.userId === currUser.id ||
        n.userId === currUser.studentId ||
        n.userId === currUser.employeeId ||
        n.userId === currUser.email ||
        (currUser.role === 'ADMIN' && (n.userId === 'ADMIN' || n.userId === 'ALL_ADMINS' || n.userId === 'ALL' || n.userId === 'ALL_USERS')) ||
        ((currUser.role === 'TEACHER' || currUser.role === 'STAFF') && (n.userId === 'TEACHER' || n.userId === 'STAFF' || n.userId === 'ALL_TEACHERS' || n.userId === 'ALL' || n.userId === 'ALL_USERS')) ||
        (currUser.role === 'STUDENT' && (n.userId === 'STUDENT' || n.userId === 'ALL_STUDENTS' || n.userId === 'ALL' || n.userId === 'ALL_USERS'));
      
      return !matches;
    }));

    try {
      fetch(`${API_BASE}/notifications/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currUser?.id || currUser?.studentId || currUser?.employeeId })
      }).catch(() => {});
    } catch (e) {}
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    try {
      fetch(`${API_BASE}/notifications/${notifId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const logAction = (user, action, details) => {
    const newLog = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user ? `${user.name} (${user.role})` : 'System',
      role: user ? user.role : 'SYSTEM',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      fetch(`${API_BASE}/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user?.id || user?.studentId || user?.employeeId || 'SYSTEM',
          actorRole: user?.role || 'SYSTEM',
          action,
          entityType: 'SYSTEM',
          entityId: user?.id || '',
          details
        })
      }).catch(() => {});
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // USER (STUDENTS, TEACHERS, ADMINS) MANAGEMENT CRUD
  // -------------------------------------------------------------
  const addStudent = async (studentData, actorUser) => {
    const studentId = studentData.studentId || `STU-${getCurrentYear()}-${String(users.filter(u => u.role === 'STUDENT').length + 1).padStart(3, '0')}`;
    const newStudent = {
      id: studentData.id || `stu-${Date.now()}`,
      studentId,
      rollNo: studentData.rollNo || studentId,
      registerNumber: studentData.registerNumber || generateRegisterNumber(),
      name: studentData.name,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@kalpanaaa.edu`,
      phone: studentData.phone || '+91 98765 43210',
      role: 'STUDENT',
      department: studentData.department || 'Computer Science & Engineering',
      course: studentData.course || 'B.Tech Computer Science & Engineering',
      semester: studentData.semester || '1st Semester',
      section: studentData.section || 'Sec A',
      status: studentData.status || 'Active',
      password: studentData.password || 'student123',
      parentName: studentData.parentName || '',
      parentPhone: studentData.parentPhone || '',
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      gpa: studentData.gpa || '0.00',
      overallAttendance: studentData.overallAttendance || '0%',
      pendingFees: Number(studentData.pendingFees || 0),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newStudent, ...prev]);

    try {
      await fetch(`${API_BASE}/auth/student-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      }).catch(() => {});
    } catch (e) {}

    logAction(actorUser, 'STUDENT_CREATED', `Enrolled student ${newStudent.name} (${studentId})`);
    return newStudent;
  };

  const addTeacher = async (teacherData, actorUser) => {
    const empId = teacherData.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newTeacher = {
      id: `user-teacher-${Date.now()}`,
      name: teacherData.name,
      email: teacherData.email,
      password: teacherData.password || 'teacher123',
      employeeId: empId,
      designation: teacherData.designation || 'Assistant Professor',
      department: teacherData.department,
      qualification: teacherData.qualification || 'M.Tech / Ph.D.',
      specialization: teacherData.specialization || 'Engineering',
      experience: teacherData.experience || '5 Years',
      phone: teacherData.phone || '',
      role: 'TEACHER',
      status: teacherData.status || 'Active',
      assignedClasses: teacherData.assignedClasses || [],
      assignedSubjects: teacherData.assignedSubjects || [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newTeacher, ...prev]);

    try {
      await fetch(`${API_BASE}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher)
      });
    } catch (err) {}

    logAction(actorUser, 'TEACHER_CREATED', `Registered faculty account for ${newTeacher.name} (${empId})`);
    return newTeacher;
  };

  const updateUser = (userId, updatedFields, actorUser) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.studentId === userId || u.employeeId === userId) {
        const updated = { ...u, ...updatedFields };
        return updated;
      }
      return u;
    }));

    try {
      fetch(`${API_BASE}/students/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      }).catch(() => {});
    } catch (e) {}

    logAction(actorUser, 'USER_UPDATED', `Updated parameters for user ID ${userId}`);
  };

  const deleteUser = (userId, actorUser) => {
    setUsers(prev => prev.filter(u => u.id !== userId && u.studentId !== userId && u.employeeId !== userId));

    try {
      fetch(`${API_BASE}/students/${userId}`, { method: 'DELETE' }).catch(() => {});
      fetch(`${API_BASE}/teachers/${userId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

    logAction(actorUser, 'USER_DELETED', `Deleted user account ${userId}`);
  };

  const toggleUserStatus = (userId, actorUser) => {
    let newStatus = 'Active';
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.studentId === userId || u.employeeId === userId) {
        newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        logAction(actorUser, 'USER_STATUS_TOGGLED', `Updated ${u.name} status to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));

    try {
      fetch(`${API_BASE}/students/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(() => {});
    } catch (e) {}
  };

  const resetUserAccount = (userId, newPassword, actorUser) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.studentId === userId || u.employeeId === userId) {
        logAction(actorUser, 'USER_PASSWORD_RESET', `Reset password for user ${u.name}`);
        return { ...u, password: newPassword };
      }
      return u;
    }));
  };

  // -------------------------------------------------------------
  // DEPARTMENT MANAGEMENT CRUD
  // -------------------------------------------------------------
  const addDepartment = (deptData, actorUser) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      name: deptData.name,
      code: deptData.code,
      hod: deptData.hod || 'Unassigned',
      description: deptData.description || '',
      status: deptData.status || 'Active',
      totalFaculty: Number(deptData.totalFaculty || 0),
      totalStudents: Number(deptData.totalStudents || 0)
    };
    setDepartments(prev => [newDept, ...prev]);
    logAction(actorUser, 'DEPARTMENT_CREATED', `Created department ${newDept.name} (${newDept.code})`);
    return newDept;
  };

  const updateDepartment = (deptId, updatedFields, actorUser) => {
    setDepartments(prev => prev.map(d => d.id === deptId ? { ...d, ...updatedFields } : d));
    logAction(actorUser, 'DEPARTMENT_UPDATED', `Updated department ID ${deptId}`);
  };

  const deleteDepartment = (deptId, actorUser) => {
    setDepartments(prev => prev.filter(d => d.id !== deptId && d.code !== deptId));
    try {
      fetch(`${API_BASE}/departments/${deptId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
    logAction(actorUser, 'DEPARTMENT_DELETED', `Deleted department ${deptId}`);
  };

  // -------------------------------------------------------------
  // COURSE MANAGEMENT CRUD
  // -------------------------------------------------------------
  const addCourse = async (courseData, actorUser) => {
    const newCourse = {
      id: `crs-${Date.now()}`,
      name: courseData.name,
      code: courseData.code,
      department: courseData.department || 'Computer Science & Engineering',
      departmentCode: courseData.departmentCode || (courseData.code ? String(courseData.code).split('-')[0] : 'CSE'),
      semester: courseData.semester || 'Semester 1',
      credits: Number(courseData.credits || 4),
      courseType: courseData.type || courseData.courseType || 'Core Theory',
      assignedTeacherName: courseData.assignedTeacherName || 'Faculty In-Charge',
      status: courseData.status || 'Active'
    };
    setCourses(prev => [newCourse, ...prev]);
    setSubjects(prev => [newCourse, ...prev]);
    setSubjectOfferings(prev => [newCourse, ...prev]);

    try {
      await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
    } catch (e) {}

    logAction(actorUser, 'COURSE_CREATED', `Created course ${newCourse.name} (${newCourse.code})`);
    return newCourse;
  };

  const updateCourse = async (courseId, updatedFields, actorUser) => {
    setCourses(prev => prev.map(c => (c.id === courseId || c.code === courseId) ? { ...c, ...updatedFields } : c));
    setSubjects(prev => prev.map(s => (s.id === courseId || s.code === courseId) ? { ...s, ...updatedFields } : s));
    setSubjectOfferings(prev => prev.map(s => (s.id === courseId || s.code === courseId) ? { ...s, ...updatedFields } : s));

    try {
      await fetch(`${API_BASE}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {}

    logAction(actorUser, 'COURSE_UPDATED', `Updated course ID ${courseId}`);
  };

  const deleteCourse = async (courseId, actorUser) => {
    setCourses(prev => prev.filter(c => c.id !== courseId && c.code !== courseId));
    setSubjects(prev => prev.filter(s => s.id !== courseId && s.code !== courseId));
    setSubjectOfferings(prev => prev.filter(s => s.id !== courseId && s.code !== courseId));

    try {
      await fetch(`${API_BASE}/courses/${courseId}`, { method: 'DELETE' });
    } catch (e) {}

    logAction(actorUser, 'COURSE_DELETED', `Deleted course ${courseId}`);
  };

  // -------------------------------------------------------------
  // SUBJECT MANAGEMENT CRUD
  // -------------------------------------------------------------
  const addSubject = (subjectData, actorUser) => {
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: subjectData.name,
      code: subjectData.code,
      department: subjectData.department,
      course: subjectData.course,
      semester: subjectData.semester,
      credits: Number(subjectData.credits || 4),
      subjectType: subjectData.subjectType || 'Core Theory',
      assignedTeacherId: subjectData.assignedTeacherId || '',
      assignedTeacherName: subjectData.assignedTeacherName || 'Unassigned',
      status: subjectData.status || 'Active'
    };
    setSubjects(prev => [newSubject, ...prev]);
    logAction(actorUser, 'SUBJECT_CREATED', `Created subject ${newSubject.name} (${newSubject.code})`);
    return newSubject;
  };

  const updateSubject = (subjectId, updatedFields, actorUser) => {
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, ...updatedFields } : s));
    logAction(actorUser, 'SUBJECT_UPDATED', `Updated subject ID ${subjectId}`);
  };

  const deleteSubject = (subjectId, actorUser) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    logAction(actorUser, 'SUBJECT_DELETED', `Deleted subject ${subjectId}`);
  };

  // -------------------------------------------------------------
  // FACULTY CLASS ASSIGNMENT (FCA) METHODS
  // -------------------------------------------------------------
  const allocateFacultyClassAssignment = (allocationData, adminUser) => {
    const facultyObj = users.find(u => u.employeeId === allocationData.facultyId || u.id === allocationData.facultyId);
    if (!facultyObj) {
      alert('Faculty member not found.');
      return { success: false, error: 'Faculty member not found.' };
    }

    const classId = `CLS-${allocationData.departmentCode || 'ENG'}-${allocationData.year.charAt(0)}-${allocationData.semester.replace(/\s+/g, '').toUpperCase()}-${allocationData.subjectCode}`;
    const realCohortCount = users.filter(u =>
      (u.role === 'STUDENT' || (u.studentId && String(u.studentId).startsWith('STU'))) &&
      (!allocationData.departmentCode || !u.departmentCode || String(u.departmentCode).toUpperCase() === String(allocationData.departmentCode).toUpperCase()) &&
      (!allocationData.year || !u.year || String(u.year).toLowerCase() === String(allocationData.year).toLowerCase())
    ).length;

    const newAssignment = {
      assignmentId: `FCA-${getCurrentYear()}-${Math.floor(100 + Math.random() * 900)}`,
      classId,
      facultyId: facultyObj.employeeId || facultyObj.id,
      facultyName: facultyObj.name,
      departmentCode: allocationData.departmentCode,
      departmentName: facultyObj.department || allocationData.departmentCode,
      year: allocationData.year,
      semester: allocationData.semester,
      subjectCode: allocationData.subjectCode,
      subjectName: allocationData.subjectName,
      academicYear: getAcademicYear(),
      studentCount: realCohortCount > 0 ? realCohortCount : users.filter(u => u.role === 'STUDENT').length,
      assignedDate: new Date().toISOString().split('T')[0],
      startDate: `${getCurrentYear()}-08-01`,
      endDate: `${getCurrentYear()}-12-20`,
      status: 'ACTIVE'
    };

    setFacultyClassAssignments(prev => [newAssignment, ...prev]);
    const updatedCount = facultyClassAssignments.filter(f => f.facultyId === newAssignment.facultyId).length + 1;

    try {
      fetch(`${API_BASE}/faculty-assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment)
      }).catch(() => {});
    } catch (e) {}

    logAction(adminUser, 'FACULTY_CLASS_ASSIGNED', `Assigned ${facultyObj.name} to ${newAssignment.subjectName} (${newAssignment.year}, ${newAssignment.semester}).`);
    return { success: true, assignment: newAssignment, workloadCount: updatedCount };
  };

  const removeFacultyClassAssignment = (assignmentId, adminUser) => {
    setFacultyClassAssignments(prev => prev.filter(f => f.assignmentId !== assignmentId));

    try {
      fetch(`${API_BASE}/faculty-assignments/${assignmentId}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch (e) {}

    logAction(adminUser, 'FACULTY_CLASS_UNASSIGNED', `Removed faculty class assignment ${assignmentId}.`);
  };

  // -------------------------------------------------------------
  // ATTENDANCE WORKFLOW METHODS
  // -------------------------------------------------------------
  const markAttendance = (records, actorUser) => {
    // If it's a single record correction
    if (records.length === 1 && records[0].id) {
      const rec = records[0];
      setAttendance(prev => prev.map(a => a.id === rec.id ? { ...a, status: rec.status } : a));
      fetch(`${API_BASE}/attendance/${rec.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: rec.status })
      }).catch(() => {});
      logAction(actorUser, 'ATTENDANCE_CORRECTED', `Corrected attendance record ${rec.id} to ${rec.status}`);
      return;
    }

    const newEntries = records.map((r, idx) => ({
      id: r.id || `att-${Date.now()}-${idx}-${Math.floor(100 + Math.random() * 900)}`,
      studentId: r.studentId,
      studentName: r.studentName,
      subjectCode: r.subjectCode,
      subjectName: r.subjectName,
      classId: r.classId || null,
      date: r.date || new Date().toISOString().split('T')[0],
      period: r.period || '09:30 AM',
      status: r.status || 'Present',
      markedBy: actorUser?.employeeId || actorUser?.id || null
    }));

    setAttendance(prev => [...newEntries, ...prev]);

    fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: newEntries })
    }).catch(() => {});

    records.forEach(r => {
      if (r.status === 'Absent') {
        dispatchNotification(
          r.studentId,
          'Attendance Alert: Marked Absent',
          `You were marked ABSENT for ${r.subjectName} (${r.subjectCode}) on ${r.date}.`
        );
      }
    });

    logAction(actorUser, 'ATTENDANCE_MARKED', `Marked attendance for ${records.length} students on ${records[0]?.subjectCode}`);
  };

  const markClassAttendance = (classId, date, records, actorUser) => {
    const newEntries = records.map((r, idx) => ({
      id: r.id || `att-${Date.now()}-${idx}-${Math.floor(100 + Math.random() * 900)}`,
      classId,
      studentId: r.studentId,
      studentName: r.studentName,
      subjectCode: r.subjectCode || 'GEN-101',
      subjectName: r.subjectName || 'Core Lecture',
      date,
      period: '09:30 AM',
      status: r.status || 'Present',
      markedBy: actorUser?.employeeId || actorUser?.id || null
    }));

    setAttendance(prev => [...newEntries, ...prev]);

    fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: newEntries })
    }).catch(() => {});

    logAction(actorUser, 'CLASS_ATTENDANCE_MARKED', `Faculty ${actorUser?.name} marked attendance for ${records.length} students in class ${classId} on ${date}.`);
  };

  const updateAttendanceRecord = (attId, newStatus, actorUser) => {
    setAttendance(prev => prev.map(a => a.id === attId ? { ...a, status: newStatus } : a));
    fetch(`${API_BASE}/attendance/${attId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
    logAction(actorUser, 'ATTENDANCE_UPDATED', `Corrected attendance record ${attId} to ${newStatus}`);
  };

  const markTeacherAttendance = (attId, newStatus, remarks, actorUser) => {
    setTeacherAttendance(prev => prev.map(a => a.id === attId ? { ...a, status: newStatus, remarks: remarks || a.remarks } : a));
    fetch(`${API_BASE}/teacher-attendance/${attId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, remarks })
    }).catch(() => {});
    logAction(actorUser, 'TEACHER_ATTENDANCE_CORRECTED', `Admin corrected teacher attendance record ${attId} to ${newStatus}`);
  };

  // -------------------------------------------------------------
  // ASSIGNMENTS REAL-TIME WORKFLOW
  // -------------------------------------------------------------
  const addAssignment = async (assignmentData, staffUser) => {
    const createdAssignment = {
      id: `ASN-${getCurrentYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: assignmentData.title,
      subject: assignmentData.subject,
      code: assignmentData.subject?.split(' ')[0] || 'CS-601',
      class: `${assignmentData.class || 'B.Tech CSE'} ${assignmentData.section || ''}`,
      teacherId: staffUser.employeeId || staffUser.id || 'EMP-101',
      teacherName: staffUser.name || 'Faculty Staff',
      description: assignmentData.description || '',
      instructions: assignmentData.instructions || '',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: assignmentData.dueDate,
      maxMarks: Number(assignmentData.maxMarks || 30),
      status: assignmentData.status || 'PUBLISHED',
      submissions: []
    };

    setAssignments(prev => [createdAssignment, ...prev]);

    try {
      await fetch(`${API_BASE}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdAssignment)
      });
    } catch (err) {}

    dispatchNotification('ALL_STUDENTS', `New Assignment Published: ${createdAssignment.title}`, `Faculty ${createdAssignment.teacherName} published ${createdAssignment.title} for ${createdAssignment.subject}. Due: ${createdAssignment.dueDate}.`);
    logAction(staffUser, 'ASSIGNMENT_CREATED', `Staff published assignment ${createdAssignment.title} for ${createdAssignment.subject}.`);
    return createdAssignment;
  };

  const addClassAssignment = (classId, assignmentData, actorUser) => {
    const newAsn = {
      id: `ASN-CLS-${Date.now()}`,
      classId,
      title: assignmentData.title,
      description: assignmentData.description,
      dueDate: assignmentData.dueDate,
      maxMarks: assignmentData.maxMarks || 30,
      teacherName: actorUser?.name || 'Faculty Staff',
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'PUBLISHED',
      submissions: []
    };

    setAssignments(prev => [newAsn, ...prev]);
    dispatchNotification('ALL_STUDENTS', `New Assignment: ${newAsn.title}`, `Faculty ${newAsn.teacherName} assigned coursework. Due: ${newAsn.dueDate}.`);
    logAction(actorUser, 'CLASS_ASSIGNMENT_CREATED', `Faculty created assignment ${newAsn.title} for class ${classId}.`);
    return newAsn;
  };

  const submitAssignment = async (assignmentId, submissionData, studentUser) => {
    const studentId = studentUser.studentId || studentUser.username || studentUser.id;
    const studentName = studentUser.name;
    const fileName = submissionData.fileName || 'Assignment_Submission.pdf';
    const comments = submissionData.comments || '';

    setAssignments(prev => prev.map(asn => {
      if (asn.id === assignmentId) {
        const newSubmission = {
          studentId,
          studentName,
          submittedDate: new Date().toISOString().split('T')[0],
          file: fileName,
          fileSize: submissionData.fileSize || '1.8 MB',
          comments,
          marks: null,
          feedback: '',
          status: 'Submitted'
        };

        const filteredSubs = (asn.submissions || []).filter(s => s.studentId !== studentId);
        return {
          ...asn,
          submissions: [newSubmission, ...filteredSubs]
        };
      }
      return asn;
    }));

    try {
      await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          fileName,
          comments
        })
      });
    } catch (e) {}

    logAction(studentUser, 'ASSIGNMENT_SUBMITTED', `Student ${studentUser.name} submitted work for assignment ${assignmentId}.`);
  };

  const gradeSubmission = async (assignmentId, studentId, marks, feedback, staffUser) => {
    setAssignments(prev => prev.map(asn => {
      if (String(asn.id) === String(assignmentId)) {
        let found = false;
        const updatedSubs = (asn.submissions || []).map(sub => {
          const subStuId = String(sub.studentId || sub.id || '').toLowerCase();
          const subStuName = String(sub.studentName || '').toLowerCase();
          const targetId = String(studentId || '').toLowerCase();
          const isMatch = (subStuId && targetId && (subStuId === targetId || subStuId.includes(targetId) || targetId.includes(subStuId))) ||
                          (subStuName && targetId && (subStuName.includes(targetId) || targetId.includes(subStuName)));
          if (isMatch) {
            found = true;
            return {
              ...sub,
              marks: Number(marks),
              feedback: feedback || '',
              status: 'Graded'
            };
          }
          return sub;
        });

        if (!found) {
          updatedSubs.unshift({
            studentId,
            studentName: 'Enrolled Student',
            submittedDate: new Date().toISOString().split('T')[0],
            file: 'Assignment_Submission.pdf',
            marks: Number(marks),
            feedback: feedback || '',
            status: 'Graded'
          });
        }

        dispatchNotification(studentId, `Assignment Graded: ${asn.title}`, `Your submission for ${asn.title} was graded: ${marks}/${asn.maxMarks}. Feedback: ${feedback}`);

        return {
          ...asn,
          submissions: updatedSubs
        };
      }
      return asn;
    }));

    try {
      await fetch(`${API_BASE}/assignments/${assignmentId}/submissions/${studentId}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marks: Number(marks),
          feedback,
          gradedBy: staffUser?.name || staffUser?.employeeId || 'Faculty'
        })
      });
    } catch (e) {}

    logAction(staffUser, 'ASSIGNMENT_GRADED', `Staff graded submission for student ${studentId} on assignment ${assignmentId}: ${marks} marks.`);
  };

  const deleteAssignment = async (assignmentId, actorUser) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    try {
      await fetch(`${API_BASE}/assignments/${assignmentId}`, { method: 'DELETE' });
    } catch (e) {}
    logAction(actorUser, 'ASSIGNMENT_DELETED', `Deleted assignment ${assignmentId}`);
  };

  // -------------------------------------------------------------
  // EXAMINATION & MARKS WORKFLOW METHODS
  // -------------------------------------------------------------
  const addExamination = (examData, actorUser) => {
    const newExam = {
      id: `EXAM-${Date.now()}`,
      name: examData.name,
      type: examData.type || 'Mid-Term',
      department: examData.department,
      course: examData.course,
      semester: examData.semester,
      subjectCode: examData.subjectCode,
      subjectName: examData.subjectName,
      assignedTeacherId: examData.assignedTeacherId || '',
      date: examData.date,
      time: examData.time || '10:00 AM - 01:00 PM',
      room: examData.room || 'Main Hall',
      maxMarks: Number(examData.maxMarks || 100),
      eligibilityAttendance: Number(examData.eligibilityAttendance || 75),
      status: 'Marks Pending',
      isPublished: false
    };

    setExaminations(prev => [newExam, ...prev]);

    const matchingStudents = users.filter(u => u.role === 'STUDENT' && u.course === examData.course && u.semester === examData.semester);
    matchingStudents.forEach(stu => {
      dispatchNotification(
        stu.studentId || stu.username || stu.id,
        `New Exam Scheduled: ${newExam.subjectName}`,
        `${newExam.name} for ${newExam.subjectName} is scheduled on ${newExam.date} at ${newExam.time} (${newExam.room}).`
      );
    });

    logAction(actorUser, 'EXAM_CREATED', `Created examination ${newExam.name} for ${newExam.subjectCode}`);
    return newExam;
  };

  const updateExamination = (examId, updatedFields, actorUser) => {
    setExaminations(prev => prev.map(ex => ex.id === examId ? { ...ex, ...updatedFields } : ex));
    logAction(actorUser, 'EXAM_UPDATED', `Updated exam ID ${examId}`);
  };

  const deleteExamination = (examId, actorUser) => {
    setExaminations(prev => prev.filter(e => e.id !== examId));
    logAction(actorUser, 'EXAM_DELETED', `Deleted exam ${examId}`);
  };

  const submitMarksByTeacher = (examId, studentMarksList, teacherUser) => {
    const newMarksRecords = studentMarksList.map((sm, idx) => ({
      id: `MRK-${Date.now()}-${idx}`,
      examId,
      studentId: sm.studentId,
      studentName: sm.studentName,
      subjectCode: sm.subjectCode,
      subjectName: sm.subjectName,
      marksObtained: Number(sm.marksObtained),
      maxMarks: Number(sm.maxMarks || 100),
      grade: sm.grade || (sm.marksObtained >= 90 ? 'O' : sm.marksObtained >= 80 ? 'A+' : sm.marksObtained >= 70 ? 'A' : sm.marksObtained >= 60 ? 'B+' : 'B'),
      teacherSubmitted: true,
      published: false,
      remarks: sm.remarks || ''
    }));

    setMarksRecords(prev => {
      const remaining = prev.filter(m => m.examId !== examId);
      return [...newMarksRecords, ...remaining];
    });

    setExaminations(prev => prev.map(ex => ex.id === examId ? { ...ex, status: 'Marks Submitted' } : ex));

    try {
      fetch(`${API_BASE}/marks/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, marks: newMarksRecords })
      }).catch(() => {});
    } catch (e) {}

    logAction(teacherUser, 'EXAM_MARKS_SUBMITTED', `Teacher ${teacherUser.name} submitted marks for exam ${examId}`);
  };

  const publishExamResults = (examId, adminUser) => {
    setExaminations(prev => prev.map(ex => {
      if (ex.id === examId) {
        return { ...ex, status: 'Results Published', isPublished: true, published: true };
      }
      return ex;
    }));

    setMarksRecords(prev => prev.map(m => {
      if (m.examId === examId) {
        dispatchNotification(
          m.studentId,
          'Official Examination Results Published!',
          `Results for ${m.subjectName} (${m.subjectCode}) have been published. Grade: ${m.grade}, Score: ${m.marksObtained}/${m.maxMarks}.`
        );
        return { ...m, published: true };
      }
      return m;
    }));

    try {
      fetch(`${API_BASE}/examinations/${examId}/publish`, {
        method: 'PUT'
      }).catch(() => {});
    } catch (e) {}

    logAction(adminUser, 'EXAM_RESULTS_PUBLISHED', `Admin published official results for exam ${examId}`);
  };

  // -------------------------------------------------------------
  // FEE MANAGEMENT & PAYMENT TRANSACTIONS
  // -------------------------------------------------------------
  const recordFeePayment = (paymentData, studentUser) => {
    const studentId = paymentData.studentId || studentUser.studentId || studentUser.username || studentUser.id;
    const amount = Number(paymentData.amount || 0);
    const newTxn = {
      id: paymentData.txnId || generateTransactionId(),
      studentId,
      date: new Date().toISOString().split('T')[0],
      feeType: paymentData.feeCategory || 'Tuition Fee Payment',
      amount,
      method: paymentData.method || 'Online Payment',
      status: 'Success'
    };

    setFees(prev => [newTxn, ...prev]);

    // Deduct pending balance for student
    setUsers(prev => prev.map(u => {
      if (u.id === studentId || u.studentId === studentId || u.username === studentId) {
        const currentPending = Number(u.pendingFees || 0);
        const updatedPending = Math.max(0, currentPending - amount);
        return { ...u, pendingFees: updatedPending };
      }
      return u;
    }));

    try {
      fetch(`${API_BASE}/fees/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          amount,
          feeType: newTxn.feeType,
          paymentMethod: newTxn.method
        })
      }).catch(() => {});
    } catch (e) {}

    dispatchNotification(studentId, 'Fee Payment Successful', `Payment of ₹${amount.toLocaleString('en-IN')} for ${newTxn.feeType} was successfully processed (Txn ID: ${newTxn.id}).`);
    logAction(studentUser, 'FEE_PAYMENT_PROCESSED', `Payment of ₹${amount} recorded for student ${studentId} (Txn: ${newTxn.id})`);
    return newTxn;
  };

  // -------------------------------------------------------------
  // LEAVE WORKFLOW METHODS
  // -------------------------------------------------------------
  const submitLeaveRequest = async (leaveData, user) => {
    const newRequest = {
      id: `LV-${getCurrentYear()}-${Math.floor(100 + Math.random() * 900)}`,
      applicantId: user.studentId || user.employeeId || user.id,
      applicantName: user.name,
      applicantEmail: user.email,
      applicantRole: user.role,
      leaveType: leaveData.leaveType,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      days: Number(leaveData.days),
      reason: leaveData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests(prev => [newRequest, ...prev]);

    try {
      await fetch(`${API_BASE}/leave-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
    } catch (err) {}

    logAction(user, 'LEAVE_SUBMITTED', `Submitted leave request ${newRequest.id} for ${leaveData.days} days.`);
    return newRequest;
  };

  const updateLeaveStatus = async (leaveId, status, rejectionReason = '', adminUser) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === leaveId) {
        const updated = { ...req, status, rejectionReason };
        const notifTitle = status === 'Approved' ? 'Leave Request Approved' : 'Leave Request Rejected';
        const notifMsg = status === 'Approved' 
          ? `Your leave request ${req.id} from ${req.fromDate} to ${req.toDate} has been APPROVED by Management.`
          : `Your leave request ${req.id} from ${req.fromDate} to ${req.toDate} was REJECTED. Reason: ${rejectionReason}`;
        
        dispatchNotification(req.applicantId, notifTitle, notifMsg);
        return updated;
      }
      return req;
    }));

    logAction(adminUser, 'LEAVE_UPDATED', `Leave request ${leaveId} set to ${status}.`);
  };

  const deleteLeaveRequest = (leaveId, actorUser) => {
    setLeaveRequests(prev => prev.filter(l => l.id !== leaveId));
    logAction(actorUser, 'LEAVE_DELETED', `Deleted leave request ${leaveId}`);
  };

  // -------------------------------------------------------------
  // HELPDESK REAL-TIME WORKFLOW METHODS
  // -------------------------------------------------------------
  const submitHelpdeskTicket = async (ticketData, senderUser) => {
    const isStaff = senderUser.role === 'TEACHER' || senderUser.role === 'STAFF';
    const applicantRole = isStaff ? 'STAFF' : 'STUDENT';
    const staffCategories = ['Academic Query', 'Subject Doubts', 'Attendance Discrepancy', 'Internal Marks Query', 'Assignment Help', 'Academic Syllabus'];
    const targetRole = ticketData.targetRole || (isStaff ? 'ADMIN' : (staffCategories.includes(ticketData.category) ? 'STAFF' : 'ADMIN'));

    const newTicket = {
      id: `TKT-${getCurrentYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantId: senderUser.studentId || senderUser.employeeId || senderUser.username || senderUser.id,
      applicantName: senderUser.name,
      applicantEmail: senderUser.email,
      applicantRole,
      department: senderUser.department || senderUser.course || 'Institutional',
      category: ticketData.category || 'General Inquiry',
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority || 'Normal',
      targetRole,
      status: 'Open',
      responses: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setHelpdesk(prev => [newTicket, ...prev]);

    try {
      await fetch(`${API_BASE}/helpdesk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
    } catch (err) {}

    dispatchNotification(targetRole === 'STAFF' ? 'ALL_TEACHERS' : 'ADMIN', `Support Ticket Created: ${newTicket.subject}`, `New ${applicantRole} Ticket ${newTicket.id} (${newTicket.category}) created by ${newTicket.applicantName}.`);
    logAction(senderUser, 'HELPDESK_TICKET_CREATED', `${applicantRole} created helpdesk ticket ${newTicket.id}.`);
    return newTicket;
  };

  const replyHelpdeskTicket = async (ticketId, replyMessage, respondingUser) => {
    const newResponse = {
      id: `rep-${Date.now()}`,
      author: respondingUser?.name || 'Administrative Officer',
      role: respondingUser?.role || 'ADMIN',
      message: replyMessage,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHelpdesk(prev => prev.map(tkt => {
      if (tkt.id === ticketId) {
        const existingResponses = Array.isArray(tkt.responses) ? tkt.responses : (typeof tkt.replies === 'string' ? JSON.parse(tkt.replies) : (tkt.replies || []));
        const updatedResponses = [...existingResponses, newResponse];
        
        dispatchNotification(
          tkt.applicantId || tkt.studentId,
          `Response on Ticket ${tkt.id}`,
          `${respondingUser?.name || 'Officer'} replied to your ticket "${tkt.subject}": "${replyMessage.substring(0, 80)}..."`
        );

        return {
          ...tkt,
          status: 'Responded',
          responses: updatedResponses,
          replies: updatedResponses
        };
      }
      return tkt;
    }));

    try {
      await fetch(`${API_BASE}/helpdesk/${ticketId}/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          author: respondingUser?.name || 'Administrator',
          role: respondingUser?.role || 'ADMIN'
        })
      });
    } catch (err) {}

    logAction(respondingUser, 'HELPDESK_TICKET_REPLIED', `Responded to ticket ${ticketId}.`);
  };

  const deleteTicket = (ticketId, actorUser) => {
    setHelpdesk(prev => prev.filter(t => t.id !== ticketId));
    logAction(actorUser, 'HELPDESK_TICKET_DELETED', `Deleted ticket ${ticketId}`);
  };

  // -------------------------------------------------------------
  // ANNOUNCEMENTS, NEWS, EVENTS & ADMISSIONS
  // -------------------------------------------------------------
  const addAnnouncement = (announcementData, actorUser) => {
    const newAnn = {
      id: `ANN-${Date.now()}`,
      title: announcementData.title,
      content: announcementData.content || announcementData.message,
      category: announcementData.category || 'General Notice',
      target: announcementData.target || 'All',
      author: actorUser?.name || 'Administration',
      date: new Date().toISOString().split('T')[0]
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    dispatchNotification('ALL_STUDENTS', `Announcement: ${newAnn.title}`, `${newAnn.author}: "${newAnn.content}"`);
    logAction(actorUser, 'ANNOUNCEMENT_POSTED', `Posted announcement: ${newAnn.title}`);
    return newAnn;
  };

  const addClassAnnouncement = (classId, announcementData, actorUser) => {
    const newAnn = {
      id: `ANN-CLS-${Date.now()}`,
      classId,
      title: announcementData.title,
      content: announcementData.content,
      author: actorUser?.name || 'Faculty Staff',
      category: 'Class Announcement',
      date: new Date().toISOString().split('T')[0]
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    dispatchNotification('ALL_STUDENTS', `Class Notice: ${newAnn.title}`, `${newAnn.author}: "${newAnn.content}"`);
    logAction(actorUser, 'CLASS_ANNOUNCEMENT_POSTED', `Faculty posted announcement for class ${classId}.`);
    return newAnn;
  };

  const deleteAnnouncement = (annId, actorUser) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
    logAction(actorUser, 'ANNOUNCEMENT_DELETED', `Deleted announcement ${annId}`);
  };

  const addNews = (newsData, actorUser) => {
    const newNews = {
      id: `news-${Date.now()}`,
      title: newsData.title,
      category: newsData.category || 'Campus News',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      author: actorUser?.name || 'University Communications Desk',
      image: newsData.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1000',
      summary: newsData.summary || '',
      content: newsData.content || ''
    };
    setNews(prev => [newNews, ...prev]);
    logAction(actorUser, 'NEWS_POSTED', `Published news article: ${newNews.title}`);
    return newNews;
  };

  const deleteNews = (newsId, actorUser) => {
    setNews(prev => prev.filter(n => n.id !== newsId));
    logAction(actorUser, 'NEWS_DELETED', `Deleted news ${newsId}`);
  };

  const addEvent = (eventData, actorUser) => {
    const newEvt = {
      id: `evt-${Date.now()}`,
      title: eventData.title,
      date: eventData.date || 'TBD',
      category: eventData.category || 'ACADEMIC',
      venue: eventData.venue || 'Main Campus Auditorium'
    };
    setEvents(prev => [newEvt, ...prev]);
    logAction(actorUser, 'EVENT_CREATED', `Created event: ${newEvt.title}`);
    return newEvt;
  };

  const deleteEvent = (eventId, actorUser) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    logAction(actorUser, 'EVENT_DELETED', `Deleted event ${eventId}`);
  };

  const submitAdmissionApplication = (appData) => {
    const appRef = generateAppRef();
    const newRecord = {
      id: `app-${Date.now()}`,
      app_ref: appRef,
      full_name: appData.fullName,
      email: appData.email,
      phone: appData.phone,
      dob: appData.dob,
      gender: appData.gender || 'Male',
      course: appData.course,
      department: appData.department,
      prev_qualification: appData.prevQualification,
      prev_percentage: appData.prevPercentage,
      guardian_name: appData.guardianName,
      guardian_phone: appData.guardianPhone,
      doc_10th: appData.doc10th,
      doc_12th: appData.doc12th,
      doc_tc: appData.docTc,
      status: 'Under Verification',
      created_at: new Date().toISOString()
    };

    setAdmissionApplications(prev => [newRecord, ...prev]);

    fetch(`${API_BASE}/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    }).catch(err => console.error('Failed to post admission to server:', err));

    logAction(null, 'ADMISSION_APPLICATION_SUBMITTED', `New online admission application ${appRef} for ${appData.fullName} in ${appData.course}`);
    dispatchNotification('ADMIN', `New Admission Application: ${appData.fullName}`, `Received application for ${appData.course} (Ref: ${appRef}). Documents: 10th (${appData.doc10th}), 12th (${appData.doc12th}), TC (${appData.docTc}).`);
    return appRef;
  };

  const updateAdmissionStatus = (appId, newStatus, actorUser) => {
    setAdmissionApplications(prev => prev.map(a => (a.id === appId || a.app_ref === appId) ? { ...a, status: newStatus } : a));
    fetch(`${API_BASE}/admissions/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.error('Failed to update admission status:', err));
    logAction(actorUser, 'ADMISSION_STATUS_UPDATED', `Updated admission application ${appId} status to ${newStatus}`);
  };

  const contextValue = useMemo(() => ({
    dbConnected,
    users,
    departments,
    courses,
    subjects,
    subjectOfferings,
    facultyClassAssignments,
    allocateFacultyClassAssignment,
    removeFacultyClassAssignment,
    markAttendance,
    markClassAttendance,
    updateAttendanceRecord,
    examinations,
    marksRecords,
    leaveRequests,
    announcements,
    news,
    events,
    attendance,
    teacherAttendance,
    markTeacherAttendance,
    results,
    fees,
    recordFeePayment,
    assignments,
    addAssignment,
    addClassAssignment,
    submitAssignment,
    gradeSubmission,
    deleteAssignment,
    helpdesk,
    submitHelpdeskTicket,
    replyHelpdeskTicket,
    deleteTicket,
    notifications,
    auditLogs,
    addTeacher,
    addStudent,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserAccount,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addCourse,
    updateCourse,
    deleteCourse,
    addSubject,
    updateSubject,
    deleteSubject,
    addExamination,
    updateExamination,
    deleteExamination,
    submitMarksByTeacher,
    publishExamResults,
    submitLeaveRequest,
    updateLeaveStatus,
    deleteLeaveRequest,
    addAnnouncement,
    addClassAnnouncement,
    deleteAnnouncement,
    addNews,
    deleteNews,
    addEvent,
    deleteEvent,
    submitAdmissionApplication,
    admissionApplications,
    updateAdmissionStatus,
    dispatchNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    deleteNotification,
    logAction
  }), [
    dbConnected,
    users,
    departments,
    courses,
    subjects,
    subjectOfferings,
    facultyClassAssignments,
    examinations,
    marksRecords,
    leaveRequests,
    announcements,
    news,
    events,
    attendance,
    results,
    fees,
    assignments,
    helpdesk,
    notifications,
    auditLogs,
    admissionApplications
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
