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

      <div className="min-h-screen gradient-hero">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-surface-400 hover:text-primary-300 transition-colors mb-8 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notices
          </Link>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Edit Notice
            </h1>
            <p className="text-surface-400">
              Update the details of this notice.
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="glass rounded-2xl p-8 text-center animate-fade-in">
              <svg
                className="w-16 h-16 text-red-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-surface-200 mb-2">{error}</h2>
              <p className="text-surface-400 mb-6">The notice you&apos;re looking for doesn&apos;t exist or was deleted.</p>
              <button
                onClick={() => router.push('/')}
                className="gradient-primary text-white font-semibold py-2.5 px-6 rounded-xl hover:opacity-90 transition-all cursor-pointer"
              >
                Go Back Home
              </button>
            </div>
          )}

          {/* Form card */}
          {!loading && !error && notice && (
            <div className="glass rounded-2xl p-6 sm:p-8 animate-fade-in">
              <NoticeForm initialValues={notice} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
