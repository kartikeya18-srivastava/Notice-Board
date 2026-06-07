import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NoticeCard from '@/components/NoticeCard';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Notice {
  id: number;
  title: string;
  body: string;
  category: 'EXAM' | 'EVENT' | 'GENERAL';
  priority: 'NORMAL' | 'URGENT';
  publishDate: string;
  imageUrl?: string | null;
  createdAt: string;
}

type FilterCategory = 'ALL' | 'EXAM' | 'EVENT' | 'GENERAL';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>('ALL');

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== deleteId));
      }
    } catch (error) {
      console.error('Failed to delete notice:', error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredNotices =
    filter === 'ALL' ? notices : notices.filter((n) => n.category === filter);

  const urgentCount = notices.filter((n) => n.priority === 'URGENT').length;

  const filterButtons: { value: FilterCategory; label: string; icon: string }[] = [
    { value: 'ALL', label: 'All', icon: '🗂️' },
    { value: 'EXAM', label: 'Exams', icon: '📝' },
    { value: 'EVENT', label: 'Events', icon: '🎉' },
    { value: 'GENERAL', label: 'General', icon: '📌' },
  ];

  return (
    <>
      <Head>
        <title>Notice Board — Manage Your Notices</title>
        <meta name="description" content="A modern notice board to create, view, edit, and manage notices. Urgent notices are always displayed first." />
      </Head>

      <div className="min-h-screen gradient-page">
        {/* ─── Navbar ─── */}
        <nav className="sticky top-0 z-30 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-surface-100 hidden sm:block">Notice Board</span>
            </div>
            <Link
              href="/notices/new"
              className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Notice</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </nav>

        {/* ─── Hero Section ─── */}
        <header className="relative overflow-hidden">
          {/* Background orbs */}
          <div className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] bg-primary-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-[-50px] right-[15%] w-[300px] h-[300px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
                <span className="text-gradient">Notice Board</span>
              </h1>
              <p className="text-surface-400 text-lg sm:text-xl max-w-xl">
                Stay informed with the latest announcements and updates.
              </p>
            </div>

            {/* Stats pills */}
            {!loading && notices.length > 0 && (
              <div className="flex items-center gap-3 mt-6 animate-slide-up flex-wrap">
                <div className="glass-light px-4 py-2 rounded-full text-sm text-surface-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-400" />
                  {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
                </div>
                {urgentCount > 0 && (
                  <div className="bg-red-500/10 border border-red-500/15 px-4 py-2 rounded-full text-sm text-red-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-soft" />
                    {urgentCount} urgent
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ─── Content ─── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Category filter tabs */}
          {!loading && notices.length > 0 && (
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    filter === btn.value
                      ? 'gradient-primary text-white shadow-lg shadow-primary-500/20'
                      : 'glass-light text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  }`}
                >
                  <span>{btn.icon}</span>
                  {btn.label}
                  {btn.value === 'ALL' && (
                    <span className="ml-1 text-xs opacity-70">({notices.length})</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="text-center animate-fade-in">
                <div className="relative mx-auto mb-6 w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-surface-800" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }} />
                </div>
                <p className="text-surface-400 text-lg">Loading notices...</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && notices.length === 0 && (
            <div className="text-center py-32 animate-fade-in">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-primary-500/10 rounded-3xl blur-xl" />
                <div className="relative glass-card rounded-3xl p-10">
                  <svg className="w-20 h-20 text-surface-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-surface-100 mb-3">No notices yet</h2>
              <p className="text-surface-400 mb-8 text-lg max-w-md mx-auto">
                Create your first notice and start keeping everyone informed.
              </p>
              <Link
                href="/notices/new"
                className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-8"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Notice
              </Link>
            </div>
          )}

          {/* No results for filter */}
          {!loading && notices.length > 0 && filteredNotices.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <p className="text-surface-400 text-lg mb-4">
                No {filter.toLowerCase()} notices found.
              </p>
              <button
                onClick={() => setFilter('ALL')}
                className="btn-ghost text-sm inline-flex items-center gap-2"
              >
                Show all notices
              </button>
            </div>
          )}

          {/* Notice grid */}
          {!loading && filteredNotices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice, i) => (
                <div key={notice.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <NoticeCard
                    notice={notice}
                    onDelete={(id) => setDeleteId(id)}
                    index={i}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-surface-500 text-sm">
              © 2025 Notice Board. Built with Next.js & Prisma.
            </p>
            <div className="flex items-center gap-4 text-surface-600 text-sm">
              <a href="https://github.com/kartikeya18-srivastava/Notice-Board" target="_blank" rel="noopener noreferrer" className="hover:text-surface-300 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </footer>

        {/* ─── Delete confirmation dialog ─── */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Notice"
          message="Are you sure you want to delete this notice? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      </div>
    </>
  );
}
