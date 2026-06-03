import { z } from 'zod';

export const noticeSchema = z.object({
  title: z
    .string({
      error: 'Title is required',
    })
    .trim()
    .min(3, 'Title must be at least 3 characters'),
  body: z
    .string({
      error: 'Body is required',
    })
    .trim()
    .min(1, 'Body is required'),
  category: z.enum(['EXAM', 'EVENT', 'GENERAL'], {
    error: 'Category must be EXAM, EVENT, or GENERAL',
  }),
  priority: z.enum(['URGENT', 'NORMAL'], {
    error: 'Priority must be URGENT or NORMAL',
  }),
  publishDate: z.coerce.date({
    error: 'Publish date must be a valid date',
  }),
  image: z
    .string()
    .trim()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal(''))
    .nullable(),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
