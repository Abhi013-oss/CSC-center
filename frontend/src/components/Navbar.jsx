import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Streamlined Essential Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Track Application', path: '/track' },
    { name: 'Contact', path: '/contact' },
  ];

  // Secondary Links for Mobile Drawer
  const mobileSecondaryLinks = [
    { name: 'Notices', path: '/notices' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {!imgError ? (
              <img
                src="/logo.png"
                alt="Maa Vindhyawasini Online Centre Logo"
                className="h-10 w-auto object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5 leading-none">
                Maa Vindhyawasini Online Centre
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Digital Service Assistance
              </span>
            </div>
          </Link>

          {/* Desktop Streamlined Essential Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/account'}
                  className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>{user?.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            <Link to="/services" className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm">
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-200 bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-slate-100">
                {mobileSecondaryLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : '/account'}
                      className="w-full text-center py-2.5 px-4 rounded-lg text-slate-800 font-bold bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{isAdmin ? 'Admin Operations Desk' : 'My Customer Portal'}</span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full text-center py-2.5 px-4 rounded-lg text-red-600 font-medium bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 px-4 rounded-lg text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}

                <Link
                  to="/services"
                  className="btn-primary w-full text-center py-3 flex items-center justify-center gap-2 text-base"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
