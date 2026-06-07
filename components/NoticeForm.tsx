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
      const url = isEditing ? `/api/notices/${initialValues!.id}` : '/api/notices';
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

  const inputClasses =
    'w-full px-4 py-3 rounded-xl glass-input text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all duration-300 hover:border-surface-600/50';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm animate-slide-down">
          <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Enter a clear, descriptive title"
          className={inputClasses}
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label htmlFor="body" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Write a detailed description of the notice..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`${inputClasses} cursor-pointer`}
          >
            <option value="GENERAL">General</option>
            <option value="EXAM">Exam</option>
            <option value="EVENT">Event</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Priority <span className="text-red-400">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`${inputClasses} cursor-pointer`}
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Publish Date */}
      <div className="space-y-2">
        <label htmlFor="publishDate" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Publish Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      {/* Image URL (optional) */}
      <div className="space-y-2">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-surface-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Image URL <span className="text-surface-600 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={inputClasses}
        />
      </div>

      {/* Submit buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <span className="flex items-center justify-center gap-2">
              {isEditing ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Notice
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Notice
                </>
              )}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
