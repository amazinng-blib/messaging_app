export interface FacebookMessage {
  id: string;
  message: string;
  from: {
    name: string;
  };
  created_time: string;
}

// pages/api/get-message.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messageId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!messageId || typeof messageId !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid or missing messageId parameter' });
  }

  const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!PAGE_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Missing Facebook API credentials' });
  }

  try {
    const response = await axios.get<FacebookMessage>(
      `https://graph.facebook.com/v12.0/${messageId}`,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,message,from,created_time',
        },
      }
    );

    const message = response.data;

    res.status(200).json(message);
  } catch (error: any) {
    console.error(
      'Error fetching message:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to fetch message' });
  }
}
