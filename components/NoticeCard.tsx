import React from 'react';
import Link from 'next/link';
import { Edit, Trash2, Calendar } from 'lucide-react';
import Badge from './Badge';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: 'EXAM' | 'EVENT' | 'GENERAL';
  priority: 'URGENT' | 'NORMAL';
  publishDate: string | Date;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface NoticeCardProps {
  notice: Notice;
  onDeleteClick: (notice: Notice) => void;
}

export default function NoticeCard({ notice, onDeleteClick }: NoticeCardProps) {
  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Urgent overlay badge on the top right */}
      {notice.priority === 'URGENT' && (
        <div className="absolute top-3 right-3 z-10">
          <Badge type="priority" value="URGENT" />
        </div>
      )}

      {/* Image Banner */}
      {notice.image && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // fallback if URL is broken
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1572945281864-707973e38c77?w=800&auto=format&fit=crop&q=60';
            }}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Date and Category Row */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <Badge type="category" value={notice.category} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
          {notice.title}
        </h3>

        {/* Body */}
        <p className="text-slate-600 text-sm whitespace-pre-line line-clamp-4 flex-grow mb-6 leading-relaxed">
          {notice.body}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-auto">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => onDeleteClick(notice)}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-lg transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
