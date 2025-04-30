# University Attendance Management System

A comprehensive attendance management system for universities with the following features:

## Features

- **Multiple User Roles**: Support for students, faculty, parents, and administrators
- **Attendance Tracking**: Faculty can mark students present or absent
- **Leave Management**: Parents can submit leave applications for their children
- **Role-specific Dashboards**: Each user role has a customized dashboard view
- **User Management**: Administrators can add/manage students, faculty, and parents
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credential provider

## Application Structure

- **Authentication**: Complete login system with role-based access control
- **Dashboard**: Role-specific dashboard with relevant information
- **Attendance**: View and mark attendance with filtering options
- **Leave Requests**: Submit and process leave applications
- **User Management**: Add, view, and delete users by category

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_system"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the required environment variables in Vercel project settings
3. Deploy the application

## User Roles

### Student
- View their attendance records
- Filter attendance by date or course

### Parent
- View their child's attendance
- Submit leave applications
- Track leave application status

### Faculty
- Mark students' attendance
- Approve/reject leave applications
- View attendance statistics

### Admin
- Add/manage students
- Add/manage faculty
- Add/manage parent accounts
- View system-wide statistics 