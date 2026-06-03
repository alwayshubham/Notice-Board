import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import NoticeForm from '@/components/NoticeForm';
import { Notice } from '@/components/NoticeCard';
import { NoticeInput } from '@/lib/validators/notice';
import toast from 'react-hot-toast';

interface EditNoticeProps {
  notice: Notice;
}

export default function EditNotice({ notice }: EditNoticeProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NoticeInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Notice updated');
        router.push('/');
      } else {
        const errorData = await res.json();
        if (errorData.details) {
          throw errorData;
        } else {
          toast.error(errorData.error || 'Failed to update notice');
        }
      }
    } catch (err) {
      console.error('Update error:', err);
      const error = err as Error & { details?: Record<string, string[]> };
      if (error.details) {
        throw error;
      }
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Notice - Notice Board</title>
        <meta name="description" content="Edit an existing notice on the notice board." />
      </Head>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Notice</h1>
          <p className="text-slate-500 text-sm">
            Modify the fields below to update the bulletin notice announcement.
          </p>
        </div>

        <NoticeForm
          initialData={notice}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Update Notice"
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};

  if (typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      return {
        notFound: true,
      };
    }

    const serializedNotice = {
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    };

    return {
      props: {
        notice: serializedNotice,
      },
    };
  } catch (error) {
    console.error('Failed to fetch notice for edit:', error);
    return {
      notFound: true,
    };
  }
};
