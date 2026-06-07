import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// GET /api/notices — Fetch all notices, ordered by priority (URGENT first) then newest first
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: 'desc' },       // URGENT sorts above NORMAL
        { publishDate: 'desc' },    // then newest-first within each tier
      ],
    });
    return res.status(200).json(notices);
  } catch (error) {
    console.error('GET /api/notices error:', error);
    return res.status(500).json({ error: 'Failed to fetch notices' });
  }
}

// POST /api/notices — Create a new notice with server-side validation
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
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

    // ─── Create the notice ───
    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        publishDate: new Date(publishDate),
        imageUrl: imageUrl?.trim() || null,
      },
    });

    return res.status(201).json(notice);
  } catch (error) {
    console.error('POST /api/notices error:', error);
    return res.status(500).json({ error: 'Failed to create notice' });
  }
}
