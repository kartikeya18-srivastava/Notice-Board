import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const noticeId = parseInt(id as string, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(noticeId, res);
    case 'PUT':
      return handlePut(noticeId, req, res);
    case 'DELETE':
      return handleDelete(noticeId, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// GET /api/notices/[id] — Fetch a single notice by ID
async function handleGet(id: number, res: NextApiResponse) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    return res.status(200).json(notice);
  } catch (error) {
    console.error(`GET /api/notices/${id} error:`, error);
    return res.status(500).json({ error: 'Failed to fetch notice' });
  }
}

// PUT /api/notices/[id] — Update an existing notice with server-side validation
async function handlePut(id: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if notice exists
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // ─── Server-side validation ───
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!body?.trim()) {
      return res.status(400).json({ error: 'Body is required' });
    }

    if (!['EXAM', 'EVENT', 'GENERAL'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Must be EXAM, EVENT, or GENERAL' });
    }

    if (!['NORMAL', 'URGENT'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority. Must be NORMAL or URGENT' });
    }

    if (!publishDate || isNaN(new Date(publishDate).getTime())) {
      return res.status(400).json({ error: 'Invalid date. publishDate must be a valid date' });
    }

    // ─── Update the notice ───
    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        publishDate: new Date(publishDate),
        imageUrl: imageUrl?.trim() || null,
      },
    });

    return res.status(200).json(notice);
  } catch (error) {
    console.error(`PUT /api/notices/${id} error:`, error);
    return res.status(500).json({ error: 'Failed to update notice' });
  }
}

// DELETE /api/notices/[id] — Delete a notice
async function handleDelete(id: number, res: NextApiResponse) {
  try {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    await prisma.notice.delete({ where: { id } });
    return res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/notices/${id} error:`, error);
    return res.status(500).json({ error: 'Failed to delete notice' });
  }
}
