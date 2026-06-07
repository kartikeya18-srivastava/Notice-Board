import { useRouter } from 'next/router';

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

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: number) => void;
}

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  EXAM: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Exam' },
  EVENT: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', label: 'Event' },
  GENERAL: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'General' },
};

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const router = useRouter();
  const catStyle = categoryStyles[notice.category] || categoryStyles.GENERAL;
  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10 animate-slide-up flex flex-col">
      {/* Header — Priority + Category badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {notice.priority === 'URGENT' && (
          <span className="inline-flex items-center gap-1 bg-red-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Urgent
          </span>
        )}
        <span
          className={`${catStyle.bg} ${catStyle.text} text-xs font-medium px-2.5 py-1 rounded-full`}
        >
          {catStyle.label}
        </span>
      </div>

      {/* Image (optional) */}
      {notice.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={notice.imageUrl}
            alt={notice.title}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-surface-50 mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
        {notice.title}
      </h3>

      {/* Body */}
      <p className="text-surface-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
        {notice.body}
      </p>

      {/* Footer — Date + Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-700/50">
        <span className="text-xs text-surface-500 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formattedDate}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/notices/${notice.id}/edit`)}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-300 hover:bg-primary-500/25 transition-all duration-200 cursor-pointer font-medium"
            aria-label={`Edit notice: ${notice.title}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-all duration-200 cursor-pointer font-medium"
            aria-label={`Delete notice: ${notice.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
