'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CarFront,
  MessageSquare,
  TrendingUp,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState('admin@mikkitrade.com');
  const [userInitials, setUserInitials] = useState('A');

  useEffect(() => {
    // Get user session
    const getUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        const initials = session.user.email
          .split('@')[0]
          .split('.')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials);
      }
    };
    getUserSession();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        await supabase.auth.signOut();
        router.push('/admin/login');
      } else {
        console.error('Logout failed:', await response.text());
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/vehicles', label: 'Vehicles', icon: CarFront },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, badge: 8 },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#2b404f] to-[#1a2832] text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } z-40 shadow-xl`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen && (
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <Image src="/images/logo-motors.png" alt="Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <span className="font-bold text-lg">Mikki Trade</span>
                <p className="text-xs text-gray-300">Admin Panel</p>
              </div>
            </Link>
          )}
          {!sidebarOpen && (
            <Link href="/admin/dashboard" className="mx-auto">
              <Image src="/images/logo-motors.png" alt="Logo" width={40} height={40} className="rounded-lg" />
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  active
                    ? 'bg-[#a235c3] shadow-lg shadow-purple-500/20'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!sidebarOpen && item.badge && (
                  <span className="absolute left-12 top-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-3 p-3 w-full hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {sidebarOpen && <span>Logging out...</span>}
              </>
            ) : (
              <>
                <LogOut size={20} />
                {sidebarOpen && <span>Logout</span>}
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header/Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div>
              {title && <h1 className="text-2xl font-bold text-gray-800">{title}</h1>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a235c3] to-[#2b404f] rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {userInitials}
                </div>
                <div className="text-sm hidden md:block">
                  <p className="font-semibold text-gray-800">Admin User</p>
                  <p className="text-gray-500 text-xs">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
