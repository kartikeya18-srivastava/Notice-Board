import Head from 'next/head';
import Link from 'next/link';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>Create Notice — Notice Board</title>
        <meta name="description" content="Create a new notice on the Notice Board." />
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
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Notice
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient mb-2">
              Create Notice
            </h1>
            <p className="text-surface-400">
              Fill in the details below to publish a new notice.
            </p>
          </div>

          {/* Form card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 animate-slide-up">
            <NoticeForm />
          </div>
        </div>
      </div>
    </>
  );
}
