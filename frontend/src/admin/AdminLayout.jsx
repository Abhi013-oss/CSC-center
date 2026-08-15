import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users as UsersIcon,
  Grid,
  CreditCard,
  Bell,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  User as UserIcon,
  MailCheck,
  BarChart3,
  UserCheck,
  LifeBuoy,
  CheckSquare,
  FileSpreadsheet,
  ListTodo,
  Calendar,
  Sliders,
  CalendarDays,
  Mail
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Work Queue', path: '/admin/work-queue', icon: ListTodo },
    { name: 'Staff Roster', path: '/admin/staff', icon: UserCheck },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Customers / CRM', path: '/admin/customers', icon: UsersIcon },
    { name: 'Support Desk', path: '/admin/support', icon: LifeBuoy },
    { name: 'Staff Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Appointments Desk', path: '/admin/appointments', icon: Calendar },
    { name: 'Workflow Rules', path: '/admin/workflows', icon: Sliders },
    { name: 'Center Holidays', path: '/admin/settings/holidays', icon: CalendarDays },
    { name: 'Email Templates', path: '/admin/settings/email-templates', icon: Mail },
    { name: 'Audit Trail Logs', path: '/admin/audit-logs', icon: Shield },
    { name: 'Reports & Exports', path: '/admin/reports', icon: FileSpreadsheet },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Services Catalog', path: '/admin/services', icon: Grid },
    { name: 'Notice Banners', path: '/admin/notices', icon: Bell },
    { name: 'Contact Inquiries', path: '/admin/messages', icon: MessageSquare },
    { name: 'Payment Receipts', path: '/admin/payments', icon: CreditCard },
    { name: 'Notification Logs', path: '/admin/notifications', icon: MailCheck },
    { name: 'Center Settings', path: '/admin/settings', icon: SettingsIcon },
    { name: 'My Admin Profile', path: '/admin/profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-none">CSC ADMIN</span>
                <span className="text-[10px] text-slate-400 font-medium">Operations Panel</span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
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

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">CSC Admin</span>
        </Link>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/90 backdrop-blur-xs flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Navigation Drawer</span>
              <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-1.5">
              {adminLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-300 font-semibold bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Website</span>
            </Link>
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

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Operations Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left leading-none">
                <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 font-mono">admin@csccenter.in</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
