import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import NoticeForm from '@/components/NoticeForm';

interface Notice {
  id: number;
  title: string;
  body: string;
  category: 'EXAM' | 'EVENT' | 'GENERAL';
  priority: 'NORMAL' | 'URGENT';
  publishDate: string;
  imageUrl?: string;
}

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) {
          setError('Notice not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setNotice(data);
      } catch {
        setError('Failed to load notice');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  return (
    <>
      <Head>
        <title>{notice ? `Edit: ${notice.title}` : 'Edit Notice'} — Notice Board</title>
        <meta name="description" content="Edit an existing notice on the Notice Board." />
      </Head>

      <div className="min-h-screen gradient-page">
        {/* Navbar */}
        <nav className="sticky top-0 z-30 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-surface-100 hidden sm:block">Notice Board</span>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-surface-400 hover:text-primary-300 transition-colors mb-8 group text-sm"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notices
          </Link>

          {/* Page header */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editing
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient mb-2">
              Edit Notice
            </h1>
            <p className="text-surface-400">
              Update the details of this notice.
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-surface-800" />
                <div className="absolute inset-0 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }} />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="glass-card rounded-2xl p-10 text-center animate-scale-in">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-surface-100 mb-2">{error}</h2>
              <p className="text-surface-400 mb-6">The notice you&apos;re looking for doesn&apos;t exist or was deleted.</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                </svg>
                Go Back Home
              </button>
            </div>
          )}

          {/* Form card */}
          {!loading && !error && notice && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
              <NoticeForm initialValues={notice} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
