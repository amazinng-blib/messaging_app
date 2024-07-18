import axios from 'axios';

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;

// export const sendMessage = async (senderId: string, message: string) => {
//   const options = {
//     method: 'POST',
//     url: `https://graph.facebook.com/v17.0/me/messages`,
//     params: { access_token: PAGE_ACCESS_TOKEN },
//     headers: { 'Content-Type': 'application/json' },
//     data: {
//       recipient: { id: senderId },
//       messaging_type: 'RESPONSE',
//       message: { text: message },
//     },
//   };

//   const response = await axios.request(options);

//   return response.status === 200 && response.statusText === 'OK';
// };

export const setTypingOn = async (senderId: string) => {
  const options = {
    method: 'POST',
    url: `https://graph.facebook.com/v17.0/me/messages`,
    params: { access_token: PAGE_ACCESS_TOKEN },
    headers: { 'Content-Type': 'application/json' },
    data: {
      recipient: { id: senderId },
      sender_action: 'typing_on',
    },
  };

  const response = await axios.request(options);

  return response.status === 200 && response.statusText === 'OK';
};

export const setTypingOff = async (senderId: string) => {
  const options = {
    method: 'POST',
    url: `https://graph.facebook.com/v17.0/me/messages`,
    params: { access_token: PAGE_ACCESS_TOKEN },
    headers: { 'Content-Type': 'application/json' },
    data: {
      recipient: { id: senderId },
      sender_action: 'typing_off',
    },
  };

  const response = await axios.request(options);

  return response.status === 200 && response.statusText === 'OK';
};

interface MessageData {
  recipient: { id: string };
  message: { text: string };
}

const sendMessage = async (messageData: MessageData) => {
  const pageAccessToken = process.env.FACEBOOK_ACCESS_TOKEN || '';

  try {
    const response = await axios.post(
      'https://graph.facebook.com/v12.0/me/messages',
      messageData,
      {
        params: {
          access_token: pageAccessToken,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Message sent successfully:', response.data);
  } catch (error: any) {
    console.error(
      'Error sending message:',
      error.response?.data || error.message
    );
  }
};

export default sendMessage;
