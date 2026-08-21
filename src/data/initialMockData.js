// Official Institutional Data for Kalpanaaa Education
// 100% Real-Time Synchronized with MySQL Database

export const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Administrator",
    email: "admin@kalpanaaa.edu",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
    employeeId: "ADM-001",
    designation: "Super Administrator & Dean",
    status: "Active",
    createdAt: "2026-01-01"
  },
  {
    id: "user-admin-2",
    name: "Registrar Office",
    email: "registrar@kalpanaaa.edu",
    username: "ADM-002",
    password: "admin123",
    role: "ADMIN",
    employeeId: "ADM-002",
    designation: "University Registrar",
    status: "Active",
    createdAt: "2026-01-05"
  }
];

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-2', name: 'Information Science & Engineering', code: 'ISE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-3', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-4', name: 'Electrical & Electronics Engineering', code: 'EEE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-5', name: 'Mechanical Engineering', code: 'ME', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-6', name: 'Civil & Environmental Engineering', code: 'CE', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' },
  { id: 'dept-7', name: 'Management Studies', code: 'MBA', hod: 'Unassigned', totalFaculty: 0, totalStudents: 0, status: 'Active' }
];

export const INITIAL_STUDENTS = [];
export const INITIAL_TEACHERS = [];
export const INITIAL_COURSES = [
  // ── UNDERGRADUATE (UG) DEGREE PROGRAMS ────────────────────────────────────
  {
    id: "deg-ug-cse",
    code: "B.Tech CSE",
    name: "B.Tech in Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 120,
    fees: "₹1,20,000 / Year",
    feePerYear: 120000,
    overview: "Comprehensive undergraduate engineering program covering data structures, algorithmic design, full-stack software development, cloud computing, and AI systems.",
    merits: ["98% Placement Success • Average CTC ₹14.5 LPA", "NVIDIA Supercomputing & AWS Cloud Labs", "1-on-1 Corporate Mentorship & Internships"],
    subjects: [
      "C Programming & Problem Solving",
      "Data Structures & Algorithms",
      "Object-Oriented Programming with Java",
      "Database Management Systems (DBMS)",
      "Operating Systems & Kernel Design",
      "Computer Networks & Security",
      "Full-Stack Web Engineering",
      "Artificial Intelligence & Machine Learning"
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-ug-ise",
    code: "B.Tech ISE",
    name: "B.Tech in Information Science & Engineering",
    department: "Information Science & Engineering",
    departmentCode: "ISE",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    fees: "₹1,20,000 / Year",
    feePerYear: 120000,
    overview: "Specialized degree focusing on big data analytics, information security, distributed database architectures, web systems, and enterprise cloud solutions.",
    merits: ["96% Placement Rate in Cloud & Big Data Roles", "Google Cloud & BigQuery Official Center", "Hands-on Microservices & DevOps Pipelines"],
    subjects: [
      "Python Programming for Data Science",
      "Data Analytics & Data Mining",
      "Cloud Computing Architecture",
      "Cyber Security & Cryptography",
      "Software Architecture & Agile Methods",
      "Big Data Systems & BigQuery"
    ],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-ug-ece",
    code: "B.Tech ECE",
    name: "B.Tech in Electronics & Communication Engineering",
    department: "Electronics & Communication Engineering",
    departmentCode: "ECE",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 120,
    fees: "₹1,15,000 / Year",
    feePerYear: 115000,
    overview: "Core electronics degree covering VLSI microchip design, digital signal processing, embedded systems, microcontrollers, and wireless communications.",
    merits: ["Cadence EDA & Semiconductor VLSI Labs", "MoUs with Top Chip & Hardware Manufacturers", "Embedded Systems & IoT Innovation Center"],
    subjects: [
      "Digital Signal Processing (DSP)",
      "VLSI Microchip Design & Verilog",
      "Embedded Systems & IoT Hardware",
      "Microcontrollers & Microprocessors",
      "Analog & Digital Communication",
      "Wireless Network Systems"
    ],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-ug-eee",
    code: "B.Tech EEE",
    name: "B.Tech in Electrical & Electronics Engineering",
    department: "Electrical & Electronics Engineering",
    departmentCode: "EEE",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    fees: "₹1,10,000 / Year",
    feePerYear: 110000,
    overview: "Modern electrical engineering program specializing in electric vehicle (EV) technology, renewable power grids, control systems, and power electronics.",
    merits: ["State-of-the-Art EV Battery Research Center", "Smart Grid & High Voltage Testing Facility", "94% Placement Rate in Core Energy Sector"],
    subjects: [
      "Power Systems & Smart Grids",
      "Electric Vehicle Technology & Batteries",
      "Control Systems Engineering",
      "Electrical Machines & Drives",
      "Renewable Energy Electronics",
      "High Voltage Engineering"
    ],
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-ug-me",
    code: "B.Tech ME",
    name: "B.Tech in Mechanical Engineering",
    department: "Mechanical Engineering",
    departmentCode: "ME",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    fees: "₹1,00,000 / Year",
    feePerYear: 100000,
    overview: "Interdisciplinary mechanical program integrating robotics, 3D printing manufacturing, CAD/CAM simulation, kinematics, and thermal engineering.",
    merits: ["Industrial CAD/CAM & 3D Printing Lab", "Automotive & Robotics Prototyping Workshop", "92% Placement in Core Engineering Industries"],
    subjects: [
      "Thermodynamics & Heat Transfer",
      "Fluid Mechanics & Hydraulic Machinery",
      "Computer-Aided Design (CAD/CAM)",
      "Robotics & Industrial Automation",
      "Manufacturing Science & Metallurgy",
      "Kinematics & Dynamics of Machines"
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-ug-ce",
    code: "B.Tech CE",
    name: "B.Tech in Civil & Environmental Engineering",
    department: "Civil & Environmental Engineering",
    departmentCode: "CE",
    level: "Undergraduate (UG)",
    type: "Undergraduate Degree",
    duration: "4 Years (8 Semesters)",
    seats: 60,
    fees: "₹95,000 / Year",
    feePerYear: 95000,
    overview: "Sustainable infrastructure engineering degree covering structural design, geotechnical mechanics, environmental engineering, surveying, and BIM modeling.",
    merits: ["Smart Infrastructure & Structural Lab", "GIS Surveying & Drone Mapping Training", "Govt & Infrastructure Sector Placement Track"],
    subjects: [
      "Structural Analysis & Steel Design",
      "Geotechnical Engineering & Foundations",
      "Environmental Engineering & Waste Management",
      "Transportation & Highway Engineering",
      "Surveying & GIS Mapping",
      "Concrete Technology & BIM Modeling"
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800"
  },

  // ── POSTGRADUATE (PG) DEGREE PROGRAMS ───────────────────────────────────
  {
    id: "deg-pg-mba",
    code: "MBA",
    name: "Master of Business Administration (MBA)",
    department: "Management Studies",
    departmentCode: "MBA",
    level: "Postgraduate (PG)",
    type: "Postgraduate Degree",
    duration: "2 Years (4 Semesters)",
    seats: 60,
    fees: "₹1,50,000 / Year",
    feePerYear: 150000,
    overview: "Premier postgraduate management program with specializations in Finance, Marketing, HR, Operations, and Business Analytics with Bloomberg Terminal lab access.",
    merits: ["Bloomberg Terminal Trading Lab Certification", "Wall Street Verified Mentorship & Internships", "97% Placement Success in Top MNCs"],
    subjects: [
      "Corporate Finance & Investment Banking",
      "Marketing Management & Digital Strategy",
      "Human Resource Analytics & Talent Strategy",
      "Operations & Supply Chain Management",
      "Strategic Management & Business Leadership",
      "Financial Modeling & Bloomberg BMC"
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-pg-mtech-ai",
    code: "M.Tech AI",
    name: "M.Tech in Data Science & Artificial Intelligence",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    level: "Postgraduate (PG)",
    type: "Postgraduate Degree",
    duration: "2 Years (4 Semesters)",
    seats: 30,
    fees: "₹1,40,000 / Year",
    feePerYear: 140000,
    overview: "Advanced postgraduate degree focusing on deep learning, Large Language Models (LLMs), natural language processing, computer vision, and high-performance GPU computing.",
    merits: ["NVIDIA GPU AI Research Supercomputer", "Direct Research Paper Publication Track", "100% Placement in AI/ML Engineering"],
    subjects: [
      "Deep Learning & Neural Networks",
      "Natural Language Processing (LLMs)",
      "Computer Vision & Image Processing",
      "High-Performance GPU Computing",
      "Advanced Machine Learning Algorithms",
      "Reinforcement Learning & Robotics"
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "deg-pg-mtech-vlsi",
    code: "M.Tech VLSI",
    name: "M.Tech in VLSI Design & Embedded Systems",
    department: "Electronics & Communication Engineering",
    departmentCode: "ECE",
    level: "Postgraduate (PG)",
    type: "Postgraduate Degree",
    duration: "2 Years (4 Semesters)",
    seats: 30,
    fees: "₹1,30,000 / Year",
    feePerYear: 130000,
    overview: "Postgraduate microchip design degree focusing on advanced CMOS ASIC layout, System-on-Chip (SoC) integration, SystemVerilog UVM verification, and RTOS.",
    merits: ["Cadence VLSI Chip Tape-out Lab", "100% Industry Internship in Semiconductor MNCs", "Advanced FPGA Prototyping"],
    subjects: [
      "Advanced CMOS Digital ASIC Design",
      "Low-Power VLSI Architecture",
      "System-on-Chip (SoC) Integration",
      "SystemVerilog & UVM Verification",
      "Real-Time Operating Systems (RTOS)",
      "Physical Design Synthesis & STA"
    ],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
  }
];
export const INITIAL_SUBJECTS = [
  // Computer Science & Engineering (CSE)
  { id: "sub-cse-101", code: "CSE-101", name: "C Programming & Problem Solving", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-201", code: "CSE-201", name: "Data Structures & Algorithms", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 2", credits: 4, subjectType: "Core Lab Included" },
  { id: "sub-cse-301", code: "CSE-301", name: "Database Management Systems (DBMS)", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 3", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-401", code: "CSE-401", name: "Operating Systems & Kernel Design", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 4", credits: 4, subjectType: "Core Theory" },
  { id: "sub-cse-501", code: "CSE-501", name: "Full-Stack Web Engineering", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 5", credits: 4, subjectType: "Core Lab Included" },
  { id: "sub-cse-601", code: "CSE-601", name: "Artificial Intelligence & Machine Learning", department: "Computer Science & Engineering", departmentCode: "CSE", semester: "Semester 6", credits: 4, subjectType: "Core Theory" },

  // Information Science & Engineering (ISE)
  { id: "sub-ise-101", code: "ISE-101", name: "Python Programming for Data Science", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-201", code: "ISE-201", name: "Data Analytics & Data Mining", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-301", code: "ISE-301", name: "Cloud Computing Architecture", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 3", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ise-401", code: "ISE-401", name: "Cyber Security & Cryptography", department: "Information Science & Engineering", departmentCode: "ISE", semester: "Semester 4", credits: 4, subjectType: "Core Theory" },

  // Electronics & Communication Engineering (ECE)
  { id: "sub-ece-101", code: "ECE-101", name: "Digital Signal Processing (DSP)", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ece-201", code: "ECE-201", name: "VLSI Microchip Design & Verilog", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ece-301", code: "ECE-301", name: "Embedded Systems & IoT Hardware", department: "Electronics & Communication Engineering", departmentCode: "ECE", semester: "Semester 3", credits: 4, subjectType: "Core Lab Included" },

  // Electrical & Electronics Engineering (EEE)
  { id: "sub-eee-101", code: "EEE-101", name: "Power Systems & Smart Grids", department: "Electrical & Electronics Engineering", departmentCode: "EEE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-eee-201", code: "EEE-201", name: "Electric Vehicle Technology & Batteries", department: "Electrical & Electronics Engineering", departmentCode: "EEE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Mechanical Engineering (ME)
  { id: "sub-me-101", code: "ME-101", name: "Thermodynamics & Heat Transfer", department: "Mechanical Engineering", departmentCode: "ME", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-me-201", code: "ME-201", name: "Robotics & Industrial Automation", department: "Mechanical Engineering", departmentCode: "ME", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Civil & Environmental Engineering (CE)
  { id: "sub-ce-101", code: "CE-101", name: "Structural Analysis & Steel Design", department: "Civil & Environmental Engineering", departmentCode: "CE", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-ce-201", code: "CE-201", name: "Surveying & GIS Mapping", department: "Civil & Environmental Engineering", departmentCode: "CE", semester: "Semester 2", credits: 4, subjectType: "Core Theory" },

  // Management Studies (MBA)
  { id: "sub-mba-101", code: "MBA-101", name: "Corporate Finance & Investment Banking", department: "Management Studies", departmentCode: "MBA", semester: "Semester 1", credits: 4, subjectType: "Core Theory" },
  { id: "sub-mba-201", code: "MBA-201", name: "Financial Modeling & Bloomberg BMC", department: "Management Studies", departmentCode: "MBA", semester: "Semester 2", credits: 4, subjectType: "Core Practical" }
];
export const INITIAL_ANNOUNCEMENTS = [];
export const INITIAL_HELPDESK = [];
export const INITIAL_LEAVE_REQUESTS = [];
export const INITIAL_EXAMINATIONS = [];
export const INITIAL_FEES = [];
export const INITIAL_AUDIT_LOGS = [];
export const INITIAL_STUDENT_REQUESTS = [];
export const INITIAL_CLASSES = [];
export const INITIAL_ACADEMIC_TERMS = ['2026-2027', '2025-2026'];
export const INITIAL_NEWS = [];
export const INITIAL_EVENTS = [];
export const INITIAL_ATTENDANCE = [];
export const INITIAL_ASSIGNMENTS = [];
export const INITIAL_RESULTS = [];
export const INITIAL_MARKS = [];
