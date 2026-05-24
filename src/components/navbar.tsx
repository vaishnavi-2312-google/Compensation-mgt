'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, HelpCircle, Layers, GitBranch, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/salaries', label: 'Salaries', icon: Layers },
    { href: '/company/google', label: 'Companies', icon: BarChart3 },
    { href: '/compare', label: 'Compare', icon: GitBranch },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-custom/50 bg-bg-primary/75 backdrop-blur-md shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-sans text-xl font-bold tracking-tight text-text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary text-white shadow-sm">
                𝝣
              </span>
              <span className="font-semibold">
                Comp<span className="text-accent-primary font-bold">Intel</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              {links.map(link => {
                const isActive = pathname.startsWith(link.href) || (pathname === '/' && link.href === '/salaries' && false);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors duration-150 py-1.5 px-3 rounded-lg ${
                      isActive
                        ? 'bg-hover-custom text-accent-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-hover-custom'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-btn border border-border-custom bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-primary transition-all duration-150 hover:bg-hover-custom"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-hover-custom hover:text-text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-border-custom/50 bg-bg-primary/95 backdrop-blur-md"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map(link => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      isActive ? 'bg-hover-custom text-accent-primary' : 'text-text-secondary hover:bg-hover-custom hover:text-text-primary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border-custom mt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-btn border border-border-custom bg-bg-primary px-4 py-3 text-sm font-semibold text-text-primary hover:bg-hover-custom"
                >
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
