import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { noticeSchema } from '@/lib/validators/notice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
      return res.status(200).json(notices);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const result = noticeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { title, body, category, priority, publishDate, image } = result.data;

      const newNotice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate,
          image: image || null,
        },
      });

      return res.status(201).json(newNotice);
    } catch (error) {
      console.error('Failed to create notice:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
