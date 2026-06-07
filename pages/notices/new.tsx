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
              Create Notice
            </h1>
            <p className="text-surface-400">
              Fill in the details below to create a new notice.
            </p>
          </div>

          {/* Form card */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <NoticeForm />
          </div>
        </div>
      </div>
    </>
  );
}
