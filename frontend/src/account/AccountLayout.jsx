import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  LayoutDashboard,
  FileText,
  FolderArchive,
  CreditCard,
  Bell,
  LifeBuoy,
  Calendar,
  User as UserIcon,
  Shield,
  LogOut,
  Menu,
  X,
  Star
} from 'lucide-react';

const AccountLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const accountLinks = [
    { name: 'Portal Dashboard', path: '/account', icon: LayoutDashboard, end: true },
    { name: 'My Applications', path: '/account/applications', icon: FileText },
    { name: 'Document Manager', path: '/account/documents', icon: FolderArchive },
    { name: 'Payment Receipts', path: '/account/payments', icon: CreditCard },
    { name: 'Notification Inbox', path: '/account/notifications', icon: Bell },
    { name: 'Support Help Desk', path: '/account/support', icon: LifeBuoy },
    { name: 'Book Appointment', path: '/account/appointments', icon: Calendar },
    { name: 'Profile Settings', path: '/account/profile', icon: UserIcon },
    { name: 'Account Security', path: '/account/security', icon: Shield },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 w-full flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex-col justify-between shrink-0 h-fit sticky top-24">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="leading-tight overflow-hidden">
                <h3 className="font-bold text-slate-900 text-sm truncate">{user?.fullName || 'Customer'}</h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {accountLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Bar */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
            </div>
            <span className="font-bold text-slate-900 text-sm">{user?.fullName || 'Customer'}</span>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Collapsible Drawer Overlay */}
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-white">
                <span className="text-sm font-bold uppercase tracking-wider">Portal Navigation</span>
                <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {accountLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                        }`
                      }
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-red-400 font-semibold bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

      </div>

      <Footer />
    </div>
  );
};

export default AccountLayout;
