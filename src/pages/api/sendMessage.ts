import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface FacebookWebhookEntry {
  messaging: FacebookWebhookEvent[];
}

interface FacebookWebhookEvent {
  sender: { id: string };
  recipient: { id: string };
  message?: { text: string };
}

const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { recipientId, messageText } = req.body;
    console.log({ messageText });
    console.log('Received webhook event:');

    const messageData = {
      recipient: { id: recipientId },
      message: { text: messageText },
    };

    console.log({ messageData });

    if (!recipientId || !messageText) {
      return res
        .status(400)
        .json({ error: 'Recipient ID and message text are required' });
    }
    axios
      .post('https://graph.facebook.com/v12.0/me/messages', messageData, {
        params: {
          access_token: process.env.FACEBOOK_ACCESS_TOKEN || '',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('Message sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending message:', error.response.data);
      });

    res.status(200).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default sendMessage;
