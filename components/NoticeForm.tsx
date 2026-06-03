import React, { useState, useEffect } from 'react';
import { noticeSchema, NoticeInput } from '@/lib/validators/notice';
import { Save, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface NoticeFormProps {
  initialData?: {
    title: string;
    body: string;
    category: 'EXAM' | 'EVENT' | 'GENERAL';
    priority: 'URGENT' | 'NORMAL';
    publishDate: string | Date;
    image?: string | null;
  };
  onSubmit: (data: NoticeInput) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const formatDateForInput = (dateInput: string | Date | undefined) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function NoticeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Save Notice',
}: NoticeFormProps) {
  const [formData, setFormData] = useState<NoticeInput>({
    title: '',
    body: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    publishDate: new Date(),
    image: '',
  });

  const [dateString, setDateString] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate data if initialData changes (e.g. edit page loads)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        body: initialData.body || '',
        category: initialData.category || 'GENERAL',
        priority: initialData.priority || 'NORMAL',
        publishDate: initialData.publishDate ? new Date(initialData.publishDate) : new Date(),
        image: initialData.image || '',
      });
      setDateString(formatDateForInput(initialData.publishDate));
    } else {
      // Default date string to today for new notices
      setDateString(formatDateForInput(new Date()));
    }
  }, [initialData]);

  // Sync dateString back to formData.publishDate
  useEffect(() => {
    if (dateString) {
      setFormData((prev) => ({ ...prev, publishDate: new Date(dateString) }));
    }
  }, [dateString]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when typing
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate using Zod
    const validationResult = noticeSchema.safeParse({
      ...formData,
      // Ensure date is correctly parsed
      publishDate: dateString ? new Date(dateString) : undefined,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(validationResult.data);
    } catch (apiError) {
      const err = apiError as Error & { details?: Record<string, string[]> };
      if (err.details) {
        // Map backend validation errors
        const mappedErrors: Record<string, string> = {};
        Object.entries(err.details).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            mappedErrors[key] = value[0];
          }
        });
        setErrors(mappedErrors);
      } else {
        setErrors({ form: err.message || 'An error occurred while saving.' });
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      {errors.form && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-3 text-sm">
          <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Notice Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter a descriptive title"
          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition ${
            errors.title
              ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
          }`}
        />
        {errors.title && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.title}</p>}
      </div>

      {/* Body Field */}
      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Notice Body <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={6}
          placeholder="Enter the notice description or message..."
          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition resize-y ${
            errors.body
              ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
          }`}
        />
        {errors.body && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.body}</p>}
      </div>

      {/* Grid for Dropdowns and Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition ${
              errors.category
                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          >
            <option value="GENERAL">General</option>
            <option value="EXAM">Exam</option>
            <option value="EVENT">Event</option>
          </select>
          {errors.category && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition ${
              errors.priority
                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.priority}</p>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <label htmlFor="publishDate" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Publish Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition ${
              errors.publishDate
                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
          />
          {errors.publishDate && (
            <p className="mt-1.5 text-xs font-medium text-red-600">{errors.publishDate}</p>
          )}
        </div>
      </div>

      {/* Image URL Field */}
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Image URL <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="https://example.com/image.jpg"
          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition ${
            errors.image
              ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
              : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-500'
          }`}
        />
        {errors.image && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.image}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100">
        <Link
          href="/"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel</span>
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition flex items-center space-x-2 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
