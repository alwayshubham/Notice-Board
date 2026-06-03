import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import NoticeCard, { Notice } from '@/components/NoticeCard';
import DeleteModal from '@/components/DeleteModal';
import { Megaphone, Plus, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

interface HomeProps {
  initialNotices: Notice[];
  dbError?: boolean;
}

export default function Home({ initialNotices = [], dbError = false }: HomeProps) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isDeleting, setIsDeleting] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const refreshNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data);
      }
    } catch (err) {
      console.error('Failed to refresh notices:', err);
    }
  };

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
  };

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        toast.success('Notice deleted');
        setNoticeToDelete(null);
        await refreshNotices();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to delete notice');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Local filtering (Sorting is already handled by database query)
  const filteredNotices = notices.filter((notice) => {
    if (activeCategory === 'ALL') return true;
    return notice.category === activeCategory;
  });

  return (
    <>
      <Head>
        <title>Notice Board - Stay Updated</title>
        <meta
          name="description"
          content="View the latest exams, events, and general notices on our modern notice board."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-8">
        {/* Hero Dashboard Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/25 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-200 uppercase tracking-wider">
              <Megaphone className="h-3.5 w-3.5" />
              <span>Bulletin Board</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Stay Informed with the <br className="hidden sm:inline" />
              Latest Notices
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Welcome to the centralized Notice Board. Find information about scheduled exams,
              upcoming campus events, and general notices.
            </p>
          </div>
          {/* Subtle design element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
            <Megaphone className="w-80 h-80" />
          </div>
        </div>

        {dbError && (
          <div className="p-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-3">
            <h3 className="font-bold text-lg">Database Setup Required</h3>
            <p className="text-sm text-amber-800">
              We could not connect to your database. Please ensure your `DATABASE_URL` is configured in your environment variables, and run `npx prisma db push` to initialize the database tables.
            </p>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center space-x-2 text-slate-500 mr-2 text-sm font-medium border-r border-slate-200 pr-4 hidden md:flex">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            {['ALL', 'EXAM', 'EVENT', 'GENERAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Stats or Action */}
          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredNotices.length} {filteredNotices.length === 1 ? 'notice' : 'notices'}
          </div>
        </div>

        {/* Notices Grid */}
        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-full">
              <Megaphone className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No notices found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              There are no notices posted in this category. Click create to post the first notice.
            </p>
            <Link
              href="/notices/create"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Notice</span>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={noticeToDelete !== null}
          onClose={() => setNoticeToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        {
          priority: 'asc',
        },
        {
          publishDate: 'desc',
        },
      ],
    });

    const serializedNotices = notices.map((notice) => ({
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    }));

    return {
      props: {
        initialNotices: serializedNotices,
      },
    };
  } catch (error) {
    console.error('Database connection error in getServerSideProps:', error);
    return {
      props: {
        initialNotices: [],
        dbError: true,
      },
    };
  }
};
