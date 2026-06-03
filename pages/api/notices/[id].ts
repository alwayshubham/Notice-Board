import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { noticeSchema } from '@/lib/validators/notice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }

  try {
    const existingNotice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!existingNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    if (req.method === 'PUT') {
      const result = noticeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { title, body, category, priority, publishDate, image } = result.data;

      const updatedNotice = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate,
          image: image || null,
        },
      });

      return res.status(200).json(updatedNotice);
    } else if (req.method === 'DELETE') {
      await prisma.notice.delete({
        where: { id },
      });
      return res.status(204).end();
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(`Error handling notice ID ${id}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
