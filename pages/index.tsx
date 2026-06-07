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

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <>
      <Head>
        <title>Notice Board — Manage Your Notices</title>
        <meta name="description" content="A modern notice board to create, view, edit, and manage notices. Urgent notices are always displayed first." />
      </Head>

      <div className="min-h-screen gradient-hero">
        {/* Hero Header */}
        <header className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-72 h-72 bg-primary-700/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-2">
                  Notice Board
                </h1>
                <p className="text-surface-400 text-lg">
                  Stay updated with the latest announcements
                </p>
              </div>
              <Link
                href="/notices/new"
                className="gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary-500/25 flex items-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Notice
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Stats bar */}
          {!loading && notices.length > 0 && (
            <div className="flex items-center gap-4 mb-8 text-sm text-surface-400">
              <span className="glass-light px-3 py-1.5 rounded-lg">
                {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
              </span>
              {notices.filter((n) => n.priority === 'URGENT').length > 0 && (
                <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/20">
                  {notices.filter((n) => n.priority === 'URGENT').length} urgent
                </span>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-surface-400">Loading notices...</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && notices.length === 0 && (
            <div className="text-center py-24 animate-fade-in">
              <div className="glass-light rounded-2xl inline-block p-8 mb-6">
                <svg
                  className="w-16 h-16 text-surface-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-surface-200 mb-2">No notices yet</h2>
              <p className="text-surface-400 mb-6">Create your first notice to get started.</p>
              <Link
                href="/notices/new"
                className="gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary-500/25 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Notice
              </Link>
            </div>
          )}

          {/* Notice grid */}
          {!loading && notices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Delete confirmation dialog */}
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
