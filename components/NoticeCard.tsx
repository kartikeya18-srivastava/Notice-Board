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
  index?: number;
}

const categoryConfig: Record<string, { bg: string; text: string; label: string; icon: string; glow: string; accent: string }> = {
  EXAM: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    label: 'Exam',
    icon: '📝',
    glow: 'card-glow-purple',
    accent: 'from-purple-500/20 to-transparent',
  },
  EVENT: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    label: 'Event',
    icon: '🎉',
    glow: 'card-glow-cyan',
    accent: 'from-cyan-500/20 to-transparent',
  },
  GENERAL: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'General',
    icon: '📌',
    glow: 'card-glow-emerald',
    accent: 'from-emerald-500/20 to-transparent',
  },
};

export default function NoticeCard({ notice, onDelete, index = 0 }: NoticeCardProps) {
  const router = useRouter();
  const cat = categoryConfig[notice.category] || categoryConfig.GENERAL;
  const isUrgent = notice.priority === 'URGENT';

  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isUrgent ? 'card-glow-red' : cat.glow}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${isUrgent ? 'from-red-500 via-orange-500 to-red-500' : `${cat.accent}`} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Category glow effect on hover */}
      <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative p-5 sm:p-6 flex flex-col h-full">
        {/* Header — Priority + Category badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {isUrgent && (
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/30 animate-pulse-soft tracking-wide uppercase">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Urgent
            </span>
          )}
          <span className={`${cat.bg} ${cat.text} text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5`}>
            <span>{cat.icon}</span>
            {cat.label}
          </span>
        </div>

        {/* Image (optional) */}
        {notice.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden ring-1 ring-white/5">
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="w-full h-44 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-surface-50 mb-2.5 line-clamp-2 group-hover:text-white transition-colors duration-300 leading-snug">
          {notice.title}
        </h3>

        {/* Body */}
        <p className="text-surface-400 text-sm leading-relaxed mb-5 line-clamp-3 flex-grow group-hover:text-surface-300 transition-colors">
          {notice.body}
        </p>

        {/* Footer — Date + Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-xs text-surface-500 flex items-center gap-1.5 group-hover:text-surface-400 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={() => router.push(`/notices/${notice.id}/edit`)}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 hover:text-primary-200 transition-all duration-200 cursor-pointer font-medium flex items-center gap-1"
              aria-label={`Edit notice: ${notice.title}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(notice.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 cursor-pointer font-medium flex items-center gap-1"
              aria-label={`Delete notice: ${notice.title}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
