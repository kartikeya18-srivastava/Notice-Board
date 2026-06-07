import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface NoticeFormValues {
  id?: number;
  title: string;
  body: string;
  category: 'EXAM' | 'EVENT' | 'GENERAL';
  priority: 'NORMAL' | 'URGENT';
  publishDate: string;
  imageUrl?: string;
}

interface NoticeFormProps {
  initialValues?: NoticeFormValues;
}

export default function NoticeForm({ initialValues }: NoticeFormProps) {
  const router = useRouter();
  const isEditing = !!initialValues?.id;

  const [form, setForm] = useState<NoticeFormValues>({
    title: '',
    body: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    publishDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialValues,
        publishDate: initialValues.publishDate
          ? new Date(initialValues.publishDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        imageUrl: initialValues.imageUrl || '',
      });
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/notices/${initialValues!.id}`
        : '/api/notices';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          body: form.body,
          category: form.category,
          priority: form.priority,
          publishDate: form.publishDate,
          imageUrl: form.imageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push('/');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm animate-slide-up">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-surface-300 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Enter notice title"
          className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-surface-300 mb-2">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Enter notice description"
          className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all resize-none"
        />
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-surface-300 mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all cursor-pointer"
          >
            <option value="GENERAL">General</option>
            <option value="EXAM">Exam</option>
            <option value="EVENT">Event</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-surface-300 mb-2">
            Priority <span className="text-red-400">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all cursor-pointer"
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Publish Date */}
      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-surface-300 mb-2">
          Publish Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
        />
      </div>

      {/* Image URL (optional) */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-surface-300 mb-2">
          Image URL <span className="text-surface-500">(optional)</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
        />
      </div>

      {/* Submit button */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Notice' : 'Create Notice'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-300 hover:bg-surface-700/50 transition-all duration-200 cursor-pointer font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
