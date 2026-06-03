import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Megaphone, PlusCircle, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Megaphone className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Notice Board
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  router.pathname === '/'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/notices/create"
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                  router.pathname === '/notices/create'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow text-white'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Notice</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Notice Board App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
