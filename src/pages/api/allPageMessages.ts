import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export interface FacebookConversation {
  id: string;
}

export interface FacebookMessage {
  id: string;
  message: string;
  from: {
    name: string;
  };
}

export interface FacebookAPIResponse<T> {
  data: T[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
  const PAGE_ID = process.env.FACEBOOK_APP_ID;

  if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
    return res.status(500).json({ error: 'Missing Facebook API credentials' });
  }

  try {
    const response = await axios.get<FacebookAPIResponse<FacebookConversation>>(
      `https://graph.facebook.com/v12.0/${PAGE_ID}/conversations`,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
        },
      }
    );

    const conversations = response.data.data;

    const messagesPromises = conversations.map(async (conversation) => {
      const messagesResponse = await axios.get(
        `https://graph.facebook.com/v12.0/${conversation.id}/messages`,
        {
          params: {
            access_token: PAGE_ACCESS_TOKEN,
          },
        }
      );
      return messagesResponse.data.data;
    });

    const messages = await Promise.all(messagesPromises);

    res.status(200).json(messages.flat());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}
