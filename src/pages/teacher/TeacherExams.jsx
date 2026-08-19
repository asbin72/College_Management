import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PortalHeader } from '../../components/portal/PortalHeader';
import { Sidebar } from '../../components/portal/Sidebar';
import { ShieldCheck, Award, Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherExams = () => {
  const { currentUser } = useAuth();
  const { examinations = [], subjects = [], facultyClassAssignments = [], users = [], attendance = [] } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;

  const currentFacultyId = currentUser.employeeId || currentUser.username || currentUser.id || 'EMP-101';
  const teacherName = currentUser.name || 'Faculty Member';
  const teacherDept = currentUser.department || 'Academic Department';

  // 1. Get assigned subject codes for this teacher
  const myAssignedSubjectCodes = new Set(
    facultyClassAssignments
      .filter(fca => fca.facultyId === currentFacultyId || fca.facultyName === teacherName)
      .map(fca => fca.subjectCode)
  );

  // 2. Filter exams relevant to this staff member
  const relevantExams = examinations.filter(ex => {
    if (ex.assignedTeacherId === currentFacultyId || ex.assignedTeacherName === teacherName) return true;
    if (myAssignedSubjectCodes.has(ex.subjectCode)) return true;
    if (currentUser.departmentCode && ex.subjectCode && ex.subjectCode.startsWith(currentUser.departmentCode)) return true;
    if (currentUser.department && ex.department && ex.department.toLowerCase().includes(currentUser.department.toLowerCase())) return true;
    return false;
  });

  // If no specific exams match, show department-wide scheduled exams or active exams list
  const displayExams = relevantExams.length > 0 ? relevantExams : examinations.slice(0, 4);

  // 3. For each exam, dynamically calculate student cohort eligibility from real attendance logs
  const dynamicExamsList = displayExams.map(ex => {
    const subObj = subjects.find(s => s.code === ex.subjectCode) || {};
    
    // Find students in this exam's cohort (strictly 10 students per class)
    const cohortStudents = users.filter(u =>
      u.role === 'STUDENT' &&
      (u.departmentCode === ex.departmentCode || u.course === ex.course || (ex.subjectCode && u.departmentCode && ex.subjectCode.startsWith(u.departmentCode))) &&
      (u.semester === ex.semester || u.year === ex.year || !ex.semester)
    );

    const students = cohortStudents.length > 0 ? cohortStudents : users.filter(u => u.role === 'STUDENT').slice(0, 10);

    // Compute attendance percentage from live logs
    let eligibleCount = 0;
    let detainedCount = 0;

    students.forEach(stu => {
      const stuLogs = attendance.filter(a =>
        (a.studentId === stu.studentId || a.studentId === stu.id || a.studentId === stu.username) &&
        (a.subjectCode === ex.subjectCode || !a.subjectCode)
      );

      if (stuLogs.length === 0) {
        eligibleCount++; // Default eligible if no attendance deficiency recorded
      } else {
        const presentLogs = stuLogs.filter(a => a.status === 'Present' || a.status === 'Late').length;
        const pct = Math.round((presentLogs / stuLogs.length) * 100);
        if (pct >= (ex.eligibilityAttendance || 75)) {
          eligibleCount++;
        } else {
          detainedCount++;
        }
      }
    });

    return {
      id: ex.id,
      title: ex.name || 'End-Semester Examination',
      subject: `${ex.subjectCode || 'SUB'} - ${ex.subjectName || subObj.name || 'Curriculum Subject'}`,
      subjectCode: ex.subjectCode,
      date: ex.date || '2026-08-20',
      time: ex.time || '10:00 AM - 01:00 PM',
      hall: ex.room || ex.hall || 'Main Auditorium Hall A',
      class: ex.course ? `${ex.course} (${ex.semester || 'Current Sem'})` : `${teacherDept} Cohort`,
      type: ex.type || 'End-Semester Theory',
      invigilatorDuty: ex.type?.includes('Lab') || ex.type?.includes('Practical')
        ? `Internal Examiner (${teacherName})`
        : `Invigilator Duty Assigned (${teacherName})`,
      totalEligible: eligibleCount,
      detainedCount: detainedCount,
      isPublished: ex.isPublished
    };
  });

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-sans">
          
          {/* Header */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-navy text-xs font-bold uppercase tracking-widest bg-gold/20 px-3 py-1 rounded border border-gold/30">
                  EXAMINATION DUTIES & TIMETABLE &bull; {teacherDept}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-navy mt-2 tracking-tight">
                  Staff Examination Hub & Invigilation Duties
                </h1>
                <p className="font-serif text-slate-500 text-xs sm:text-sm mt-1">
                  View scheduled university examinations, invigilation duties, student hall eligibility, and internal marks submission for <strong>{teacherName}</strong>.
                </p>
              </div>

              <Link
                to="/staff/marks"
                className="inline-flex items-center justify-center bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs px-5 py-3 rounded-xl shadow uppercase tracking-wider flex-shrink-0"
              >
                <Award className="w-4 h-4 mr-2" />
                Enter Internal Exam Marks
              </Link>
            </div>
          </div>

          {/* EXAMINATIONS LIST */}
          <div className="space-y-4">
            {dynamicExamsList.map((ex) => (
              <div key={ex.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-num font-bold text-gold bg-navy px-2.5 py-0.5 rounded">{ex.id}</span>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded uppercase border border-purple-200">{ex.type}</span>
                      {ex.isPublished && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Results Published
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-navy mt-1">{ex.subject}</h3>
                    <span className="font-serif text-xs text-slate-500">{ex.title} &bull; Cohort: {ex.class}</span>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center w-fit border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-700" />
                    {ex.invigilatorDuty}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Date & Time</span>
                    <span className="font-num font-bold text-navy mt-0.5 block">{ex.date} &bull; {ex.time}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Examination Venue</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{ex.hall}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Eligible Students</span>
                    <span className="font-num font-bold text-emerald-700 mt-0.5 block">{ex.totalEligible} Students</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">Detained (Attendance &lt; 75%)</span>
                    <span className="font-num font-bold text-red-600 mt-0.5 block">{ex.detainedCount} Students</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    to="/staff/marks"
                    className="px-4 py-2 bg-navy text-white hover:bg-navy-light text-xs font-bold rounded-xl shadow flex items-center"
                  >
                    <Award className="w-3.5 h-3.5 mr-1.5 text-gold" />
                    Submit Internal Marks for this Subject &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};
