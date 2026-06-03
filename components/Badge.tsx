import React from 'react';

interface BadgeProps {
  type: 'category' | 'priority';
  value: string;
}

export default function Badge({ type, value }: BadgeProps) {
  if (type === 'priority') {
    if (value === 'URGENT') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white shadow-sm uppercase tracking-wider">
          URGENT
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">
        NORMAL
      </span>
    );
  }

  // category badge
  switch (value) {
    case 'EXAM':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
          EXAM
        </span>
      );
    case 'EVENT':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
          EVENT
        </span>
      );
    case 'GENERAL':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
          GENERAL
        </span>
      );
  }
}
