import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="md:max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              University Attendance System
            </h1>
            <p className="mt-6 text-xl text-white">
              A comprehensive platform for managing student attendance with role-based access for administrators, faculty, students, and parents.
            </p>
            <div className="mt-10 flex space-x-4">
              <Link 
                href="/login" 
                className="bg-white text-primary font-medium py-3 px-6 rounded-md shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for attendance management
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Admin Dashboard</h3>
                <p className="mt-2 text-base text-gray-500">
                  Manage faculty, students, and parents with comprehensive administrative controls.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Faculty Portal</h3>
                <p className="mt-2 text-base text-gray-500">
                  Record attendance, manage courses, and approve leave applications.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Student Access</h3>
                <p className="mt-2 text-base text-gray-500">
                  View personal attendance records and submit leave applications.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Parent Portal</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor student attendance and submit leave applications on behalf of students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-300 text-sm">
            © {new Date().getFullYear()} University Attendance System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 