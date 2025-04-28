import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

interface NavbarProps {
  user: {
    name: string;
    role: string;
  } | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getRoleBasedLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard' },
          { href: '/admin/faculty', label: 'Manage Faculty' },
          { href: '/admin/students', label: 'Manage Students' },
          { href: '/admin/parents', label: 'Manage Parents' },
        ];
      case 'faculty':
        return [
          { href: '/faculty/dashboard', label: 'Dashboard' },
          { href: '/faculty/courses', label: 'Courses' },
          { href: '/faculty/attendance', label: 'Attendance' },
          { href: '/faculty/leaves', label: 'Leave Requests' },
        ];
      case 'student':
        return [
          { href: '/student/dashboard', label: 'Dashboard' },
          { href: '/student/attendance', label: 'My Attendance' },
          { href: '/student/leaves', label: 'Leave Requests' },
        ];
      case 'parent':
        return [
          { href: '/parent/dashboard', label: 'Dashboard' },
          { href: '/parent/attendance', label: 'View Attendance' },
          { href: '/parent/leaves', label: 'Leave Requests' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary font-bold text-xl">
                UniAttend
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user && getRoleBasedLinks().map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FiUser className="h-6 w-6 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FiLogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
            >
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user && getRoleBasedLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'bg-primary-50 border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <FiUser className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-1" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={onLogout}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
} 