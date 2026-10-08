# Kalpanaaa Education Management Information System (ERP)

A modern, full-stack college and campus management information system built with:
- **Backend (`/backend`)**: Java 17, Spring Boot 3, Spring Security 6, JWT, Spring Data JPA, H2 / MySQL, Maven.
- **Frontend (`/frontend`)**: React 18, TypeScript, Vite, Modern CSS, React Router, TanStack React Query, Axios.

---

## 📁 Repository Structure

```
Kalpanaaa Education/
├── backend/                  # Spring Boot 3 Java 17 Backend
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/kalpanaa/education/
│       │   ├── config/       # Security, JWT, DataInitializer
│       │   ├── controller/   # REST API Controllers
│       │   ├── dto/          # DTOs
│       │   ├── exception/    # Global Exception Handler
│       │   ├── model/        # JPA Entities
│       │   ├── repository/   # Spring Data Repositories
│       │   └── service/      # Service Layer (Interfaces & Impl)
│       ├── main/resources/   # application.yml (H2) & application-mysql.yml
│       └── test/             # JUnit 5 & Spring Boot Tests
│
├── frontend/                 # React 18 + TypeScript + Vite Frontend
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/               # Static assets & logos
│   └── src/
│       ├── components/       # Common & Layout components
│       ├── context/          # Auth Context
│       ├── layouts/          # Main layout
│       ├── pages/            # Public, Admin, Teacher & Student pages
│       ├── routes/           # App route tree
│       ├── services/         # Axios API Client
│       ├── styles/           # CSS design system
│       └── types/            # TypeScript interfaces
│
├── package.json              # Monorepo task orchestration
└── DOCUMENTATION.md          # Full enterprise architecture documentation
```

---

## 🚀 Getting Started

### 1. Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
- API server runs at: `http://localhost:5000`
- In-memory H2 database console: `http://localhost:5000/h2-console`

### 2. Frontend (React + TypeScript + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Client portal runs at: `http://localhost:3000`

---

## 🔑 Demo Access Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@kalpanaaa.edu` | `admin123` |
| **Faculty / Teacher** | `teacher@kalpanaaa.edu` | `teacher123` |
| **Student** | `student@kalpanaaa.edu` | `student123` |
