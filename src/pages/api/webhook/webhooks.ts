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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const hubChallenge = req.query['hub.challenge'];
    const hubMode = req.query['hub.mode'];
    const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN || '';

    if (
      hubMode === 'subscribe' &&
      req.query['hub.verify_token'] === verifyToken
    ) {
      console.log('Webhook verified');
      res.status(200).send(hubChallenge);
    } else {
      console.error('Failed webhook verification');
      res.status(403).end();
    }
  } else if (req.method === 'POST') {
    const body = req.body;
    console.log('Received webhook event:', body);

    if (body.object === 'page') {
      (body.entry as FacebookWebhookEntry[]).forEach((entry) => {
        entry.messaging.forEach((event) => {
          if (
            event.sender &&
            event.sender.id &&
            event.recipient &&
            event.recipient.id
          ) {
            const senderId = event.sender.id;
            const recipientId = event.recipient.id;

            console.log('Sender ID:', senderId);
            console.log('Recipient ID:', recipientId);

            if (event.message && event.message.text) {
              const messageText = event.message.text;
              console.log('Received message:', messageText);
              const messageData = {
                recipient: { id: senderId },
                message: { text: 'Hi Ezumezu' },
              };

              axios
                .post(
                  'https://graph.facebook.com/v12.0/me/messages',
                  messageData,
                  {
                    params: {
                      access_token: process.env.FACEBOOK_ACCESS_TOKEN || '',
                    },
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
                .then((response) => {
                  console.log('Message sent successfully:', response.data);
                })
                .catch((error) => {
                  console.error('Error sending message:', error.response.data);
                });
            }
          } else {
            console.warn('Unexpected event structure:', event);
          }
        });
      });
    }

    res.status(200).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
