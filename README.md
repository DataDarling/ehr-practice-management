# MedPortal Pro - Electronic Health Records Practice Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

A modern, full-featured Electronic Health Records (EHR) practice management portal built with Next.js 14, demonstrating healthcare data analytics, appointment scheduling, and patient management capabilities.

## 🎯 Project Overview

This project showcases a comprehensive healthcare management system with role-based access control, real-time analytics, and modern UI/UX design. Built as a portfolio demonstration of full-stack development and data analytics skills in the healthcare domain.

## ✨ Features

### 🔐 Authentication & Role-Based Access
- **Admin**: Full system access including user management
- **Doctor**: Patient records, appointments, clinical notes, personal analytics
- **Receptionist**: Patient registration, appointment scheduling

### 📊 Analytics Dashboard
- **Appointment Trends**: 14-day rolling appointment volume visualization
- **No-Show Analytics**: Track and analyze patient no-show rates with trend analysis
- **Peak Hours Heatmap**: Visual representation of busiest clinic hours
- **Patient Demographics**: Age group distribution and gender breakdown charts
- **Doctor Utilization**: Workload metrics by physician and specialty
- **Patient Growth**: Monthly registration trends

### 👥 Patient Management
- Comprehensive patient records with demographics
- Insurance information tracking
- Medical history, allergies, and medications
- Advanced search and filtering

### 📅 Appointment Scheduling
- Interactive weekly calendar view
- Multiple appointment types (Checkup, Follow-up, Consultation, Urgent, New Patient)
- Status management (Scheduled, Confirmed, Completed, Cancelled, No-Show)
- Doctor and patient assignment

### 📝 Clinical Notes
- SOAP note format (Subjective, Objective, Assessment, Plan)
- Linked to appointments and patients
- Expandable card interface

### 👤 User Management (Admin)
- Create and manage staff accounts
- Role assignment
- Account status control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Charts**: Recharts
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **State Management**: React Query (TanStack Query)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Yarn or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ehr-practice-management.git
   cd ehr-practice-management
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/medportal?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   yarn prisma generate
   
   # Run migrations
   yarn prisma migrate dev
   
   # Seed the database with sample data
   yarn prisma db seed
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medportal.com | password123 |
| Doctor | sarah.chen@medportal.com | password123 |
| Receptionist | reception@medportal.com | password123 |

## 📁 Project Structure

```
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── analytics/        # Analytics page
│   │   ├── appointments/     # Appointment management
│   │   ├── clinical-notes/   # Clinical notes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── patients/         # Patient management
│   │   └── users/            # User management (admin)
│   ├── api/                  # API routes
│   └── login/                # Authentication pages
├── components/
│   ├── ui/                   # Reusable UI components
│   └── providers.tsx         # App providers
├── lib/
│   ├── auth-options.ts       # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   └── types.ts              # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
└── scripts/
    └── seed.ts               # Database seeding script
```

## 📈 Sample Data

The seed script populates the database with:
- **60+ patients** with diverse demographics
- **6 doctors** across different specialties
- **3,400+ appointments** spanning 4 months
- **100 clinical notes** with SOAP documentation
- Realistic show/no-show patterns (~18% no-show rate)

## 🎨 Features Preview

This application includes:
- Interactive analytics dashboards with charts and heatmaps
- Calendar-based appointment scheduling
- SOAP-formatted clinical notes
- Comprehensive patient management
- Role-based access control

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Darling Ngoh**
- LinkedIn: [linkedin.com/in/Darling-Ngoh](https://linkedin.com/in/Darling-Ngoh)
- GitHub: [@DataDarling](https://github.com/DataDarling)

---

⭐ If you found this project helpful, please give it a star!
