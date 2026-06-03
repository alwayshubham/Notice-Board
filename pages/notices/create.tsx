import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NoticeForm from '@/components/NoticeForm';
import { NoticeInput } from '@/lib/validators/notice';
import toast from 'react-hot-toast';

export default function CreateNotice() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NoticeInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        toast.success('Notice created');
        router.push('/');
      } else {
        const errorData = await res.json();
        // If there are detailed validation errors, throw them to let the form handle them
        if (errorData.details) {
          throw errorData;
        } else {
          toast.error(errorData.error || 'Failed to create notice');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      const error = err as Error & { details?: Record<string, string[]> };
      // Re-throw if it has validation details, otherwise show general toast
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
        <title>Create Notice - Notice Board</title>
        <meta name="description" content="Publish a new notice to the notice board." />
      </Head>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Notice</h1>
          <p className="text-slate-500 text-sm">
            Fill out the form below to post a new announcement to the bulletin board.
          </p>
        </div>

        <NoticeForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitButtonText="Create Notice"
        />
      </div>
    </>
  );
}
