# Kalpanaaa Education — API Permission & RBAC Access Matrix

This document provides the definitive, audit-verified role-based access control (RBAC) permission mapping for all 96 REST endpoints and web services in `server/index.js`.

Access control is enforced at the individual route registration level using:
- `authenticateToken`: Validates JWT Bearer tokens from the `Authorization` header.
- `requireRole([...])`: Enforces role-based authorization based on verified token identity.
- Rate limiters: `authRateLimiter` (strict threshold for login/signup) and `publicApiRateLimiter` (abusive traffic prevention).

---

## 96-Route RBAC Permission Table

| # | Method | Path | Allowed Roles | Rate Limit / Protection | Description |
|---|---|---|---|---|---|
| 1 | `POST` | `/api/test/reset-rate-limit` | **TEST_SECRET_HEADER** | Gated to `NODE_ENV === 'test'` | Rate limit memory clearing for test automation |
| 2 | `GET` | `/health` | **PUBLIC** | - | Health check for container/proxy monitors |
| 3 | `GET` | `/api/health` | **PUBLIC** | - | API health status & database connection probe |
| 4 | `GET` | `/` | **PUBLIC** | - | Server status welcome landing |
| 5 | `GET` | `/api/events` | **PUBLIC** | - | Server-Sent Events (SSE) real-time stream |
| 6 | `POST` | `/api/auth/login` | **PUBLIC** | `authRateLimiter` | User login (Admin, Teacher, Student) |
| 7 | `POST` | `/api/auth/student-signup` | **PUBLIC** | `authRateLimiter` | Student registration with collision retry & unique backstops |
| 8 | `PUT` | `/api/profile` | **AUTHENTICATED (ANY)** | - | Update own user profile |
| 9 | `PUT` | `/api/admin/users/:role/:id/profile` | **ADMIN** | - | Administrative override of user profiles |
| 10 | `GET` | `/api/students` | **ADMIN, TEACHER, STUDENT** | - | Retrieve enrolled student list |
| 11 | `PUT` | `/api/students/:id` | **ADMIN** | - | Update student records |
| 12 | `PATCH` | `/api/students/:id/status` | **ADMIN** | - | Toggle student Active/Inactive status |
| 13 | `POST` | `/api/students` | **ADMIN** | - | Create new student record |
| 14 | `POST` | `/api/students/activate-all` | **ADMIN** | - | Bulk activate students |
| 15 | `DELETE` | `/api/students/:id` | **ADMIN** | - | Delete student record |
| 16 | `GET` | `/api/teachers` | **ADMIN, TEACHER, STUDENT** | - | Retrieve faculty directory |
| 17 | `POST` | `/api/teachers` | **ADMIN** | - | Register new teacher |
| 18 | `DELETE` | `/api/teachers/:id` | **ADMIN** | - | Delete teacher record |
| 19 | `GET` | `/api/courses` | **PUBLIC** | - | Public course catalog |
| 20 | `POST` | `/api/courses` | **ADMIN** | - | Create academic course |
| 21 | `PUT` | `/api/courses/:id` | **ADMIN** | - | Update academic course |
| 22 | `DELETE` | `/api/courses/:id` | **ADMIN** | - | Delete academic course |
| 23 | `GET` | `/api/courses/:courseId/subjects` | **PUBLIC** | - | Subjects assigned to a course |
| 24 | `GET` | `/api/subjects` | **PUBLIC** | - | Public subject directory |
| 25 | `POST` | `/api/subjects` | **ADMIN** | - | Create subject syllabus |
| 26 | `PUT` | `/api/subjects/:id` | **ADMIN** | - | Update subject syllabus |
| 27 | `DELETE` | `/api/subjects/:id` | **ADMIN** | - | Delete subject |
| 28 | `GET` | `/api/staff-subject-assignments` | **ADMIN, TEACHER** | - | Faculty course teaching allocations |
| 29 | `GET` | `/api/subjects/:subjectId/staff` | **ADMIN, TEACHER** | - | Staff allocated to subject |
| 30 | `POST` | `/api/subjects/:subjectId/staff` | **ADMIN** | - | Assign teacher to subject |
| 31 | `DELETE` | `/api/subjects/:subjectId/staff/:teacherId` | **ADMIN** | - | Remove teacher assignment |
| 32 | `GET` | `/api/teachers/:teacherId/assigned-classes` | **ADMIN, TEACHER** | - | Classes assigned to specific faculty |
| 33 | `GET` | `/api/admissions/applications` | **ADMIN** | - | View admission applications |
| 34 | `POST` | `/api/admissions/apply` | **PUBLIC** | `publicApiRateLimiter` | Public admission application submission |
| 35 | `PUT` | `/api/admissions/applications/:id` | **ADMIN** | - | Approve/reject admission application |
| 36 | `GET` | `/api/fees` | **ADMIN, TEACHER, STUDENT** | - | View fee records |
| 37 | `POST` | `/api/fees/pay` | **STUDENT, ADMIN** | Idempotency Engine | Process fee payment (students constrained to own ID) |
| 38 | `GET` | `/api/departments` | **PUBLIC** | - | Academic departments directory |
| 39 | `GET` | `/api/departments/:id/courses` | **PUBLIC** | - | Courses under department |
| 40 | `POST` | `/api/departments` | **ADMIN** | - | Create department |
| 41 | `PUT` | `/api/departments/:id` | **ADMIN** | - | Update department |
| 42 | `DELETE` | `/api/departments/:id` | **ADMIN** | - | Delete department |
| 43 | `GET` | `/api/classes` | **ADMIN, TEACHER, STUDENT** | - | Class groupings |
| 44 | `GET` | `/api/faculty-assignments` | **ADMIN, TEACHER, STUDENT** | - | Faculty class assignments |
| 45 | `POST` | `/api/faculty-assignments` | **ADMIN** | - | Assign faculty to class |
| 46 | `DELETE` | `/api/faculty-assignments/:assignmentId` | **ADMIN** | - | Remove faculty class assignment |
| 47 | `GET` | `/api/timetable` | **ADMIN, TEACHER, STUDENT** | - | Academic schedule / timetable slots |
| 48 | `POST` | `/api/timetable` | **ADMIN** | - | Add timetable slot |
| 49 | `PUT` | `/api/timetable/:id` | **ADMIN** | - | Update timetable slot |
| 50 | `DELETE` | `/api/timetable/:id` | **ADMIN** | - | Delete timetable slot |
| 51 | `GET` | `/api/students/:id/today-subjects` | **ADMIN, TEACHER, STUDENT** | - | Student daily period schedule |
| 52 | `GET` | `/api/teachers/:id/dashboard-summary` | **ADMIN, TEACHER** | - | Teacher overview metrics |
| 53 | `GET` | `/api/teachers/:id/classes-today` | **ADMIN, TEACHER** | - | Teacher's daily lecture queue |
| 54 | `GET` | `/api/teachers/:id/attendance-overview` | **ADMIN, TEACHER** | - | Teacher attendance statistics |
| 55 | `GET` | `/api/attendance` | **ADMIN, TEACHER, STUDENT** | - | Student attendance records |
| 56 | `PUT` | `/api/attendance/:id` | **ADMIN, TEACHER** | - | Update student attendance record |
| 57 | `POST` | `/api/attendance/batch` | **ADMIN, TEACHER** | - | Batch submit attendance |
| 58 | `GET` | `/api/teacher-attendance` | **ADMIN, TEACHER** | - | Faculty attendance logs |
| 59 | `PUT` | `/api/teacher-attendance/:id` | **ADMIN, TEACHER** | - | Update faculty attendance |
| 60 | `GET` | `/api/assignments` | **ADMIN, TEACHER, STUDENT** | - | Assignment task list |
| 61 | `POST` | `/api/assignments` | **ADMIN, TEACHER** | - | Create assignment |
| 62 | `PUT` | `/api/assignments/:id` | **ADMIN, TEACHER** | - | Update assignment |
| 63 | `DELETE` | `/api/assignments/:id` | **ADMIN, TEACHER** | - | Delete assignment |
| 64 | `POST` | `/api/assignments/:id/submit` | **STUDENT** | - | Student assignment file/link submission |
| 65 | `PUT` | `/api/assignments/:id/submissions/:subId/grade` | **ADMIN, TEACHER** | - | Grade assignment submission |
| 66 | `GET` | `/api/notifications` | **ADMIN, TEACHER, STUDENT** | - | In-app notification queue |
| 67 | `POST` | `/api/notifications` | **ADMIN, TEACHER** | - | Broadcast notification |
| 68 | `PUT` | `/api/notifications/:id/read` | **ADMIN, TEACHER, STUDENT** | - | Mark notification as read |
| 69 | `PUT` | `/api/notifications/read-all` | **ADMIN, TEACHER, STUDENT** | - | Mark all notifications read |
| 70 | `DELETE` | `/api/notifications/:id` | **ADMIN, TEACHER, STUDENT** | - | Delete notification |
| 71 | `DELETE` | `/api/notifications/clear` | **ADMIN, TEACHER, STUDENT** | - | Clear notification history |
| 72 | `GET` | `/api/audit-logs` | **ADMIN** | - | Security audit trail |
| 73 | `POST` | `/api/audit-logs` | **ADMIN, TEACHER, STUDENT** | - | Log security/operational action |
| 74 | `POST` | `/api/teacher-attendance` | **ADMIN, TEACHER** | - | Clock-in faculty attendance |
| 75 | `POST` | `/api/attendance` | **ADMIN, TEACHER** | - | Single student attendance log |
| 76 | `GET` | `/api/helpdesk` | **ADMIN, TEACHER, STUDENT** | - | Helpdesk ticket index |
| 77 | `GET` | `/api/helpdesk/tickets` | **ADMIN, TEACHER, STUDENT** | - | Helpdesk ticket list |
| 78 | `GET` | `/api/users` | **ADMIN, TEACHER** | - | Unified user list across roles |
| 79 | `POST` | `/api/marks` | **ADMIN, TEACHER, STAFF** | - | Record internal marks for student |
| 80 | `POST` | `/api/contact` | **PUBLIC** | `publicApiRateLimiter` | Public contact inquiry submission |
| 81 | `POST` | `/api/helpdesk` | **ADMIN, TEACHER, STUDENT** | - | Open helpdesk ticket |
| 82 | `PUT` | `/api/helpdesk/:id/reply` | **ADMIN, TEACHER** | - | Post staff response to ticket |
| 83 | `POST` | `/api/helpdesk/:id/reply` | **ADMIN, TEACHER** | - | Alternate POST alias for ticket reply |
| 84 | `GET` | `/api/announcements` | **PUBLIC** | - | Public university bulletins |
| 85 | `POST` | `/api/announcements` | **ADMIN, TEACHER** | - | Publish university announcement |
| 86 | `GET` | `/api/leave-requests` | **ADMIN, TEACHER, STUDENT** | - | Leave applications list |
| 87 | `POST` | `/api/leave-requests` | **ADMIN, TEACHER, STUDENT** | - | Apply for academic/faculty leave |
| 88 | `PUT` | `/api/leave-requests/:id` | **ADMIN, TEACHER** | - | Approve or reject leave request |
| 89 | `GET` | `/api/examinations` | **ADMIN, TEACHER, STUDENT** | - | Examination schedule and results status |
| 90 | `POST` | `/api/examinations` | **ADMIN, TEACHER** | - | Schedule new examination |
| 91 | `PUT` | `/api/examinations/:id/publish` | **ADMIN** | - | Publish results for examination |
| 92 | `GET` | `/api/marks` | **ADMIN, TEACHER, STUDENT** | - | Retrieve all internal marks records |
| 93 | `POST` | `/api/marks/submit` | **ADMIN, TEACHER, STAFF** | - | Batch submit marks for entire examination |
| 94 | `GET` | `/api/results/student/:studentId` | **ADMIN, TEACHER, STUDENT** | - | View published results and scorecard for student |
| 95 | `POST` | `/api/admin/clean-demo-data` | **ADMIN** | Requires confirmation string | Flushes demo transaction data |
| 96 | `GET` | `*` | **PUBLIC** | - | SPA frontend static files fallback |
