import axios from 'axios';
import React, { useEffect, useState } from 'react';
require('dotenv').config();

interface FacebookMessage {
  id: string;
  message: string;
  from: {
    email: string;
    id: string;
    name: string;
  };
}

const Page = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [recievedMessages, setRecievedMessages] = useState<FacebookMessage[]>(
    []
  );
  const [responseMessage, setResponseMessage] = useState('');
  // const [messages, setMessages] = useState<MessageData>();
  const [messagesId, setMessagesId] = useState<FacebookMessage[]>([]);
  const [messageDetails, setMessageDetails] = useState<FacebookMessage>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/sendMessage', {
        messageText: prompt,
        recipientId: messageDetails?.from?.id,
      });
      setResponseMessage(
        'Message sent successfully: ' + JSON.stringify(response.data)
      );
    } catch (error: any) {
      setResponseMessage(
        'Error sending message: ' + error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/allPageMessages');
        setMessagesId(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const fetchMessages = async (): Promise<FacebookMessage[] | null> => {
    try {
      const messagePromises = messagesId.map(async (message) => {
        const response = await fetch(
          `/api/get-single-message?messageId=${message.id}`
        );
        if (response.ok) {
          const data: FacebookMessage = await response.json();
          return data;
        } else {
          throw new Error('Failed to fetch message');
        }
      });

      // Wait for all the fetch promises to resolve
      const messageArray = await Promise.all(messagePromises);

      // Set received messages
      setRecievedMessages(messageArray);

      return messageArray;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-16 flex-wrap">
      <h1 className="text-2xl font-bold my-8">
        Welcome to the Facebook Messaging App
      </h1>
      <div>
        <button
          onClick={() => fetchMessages()}
          className="px-8 py-3 rounded-[25px] font-bold text-green-700 border-4 border-gray-600"
        >
          Fetch Page Messages
        </button>
      </div>
      <div className="w-full flex gap-6 justify-center my-12">
        <div className="w-full lg:w-6/12 border-2 border-green-800 h-[20rem] overflow-y-auto p-4">
          <h2 className="text-xl font-bold my-4 text-center">All Messages</h2>
          {/* {response && <p>Response: {response}</p>} */}
          {recievedMessages?.map((receivedMessage, index) => {
            return (
              <div
                key={index}
                onClick={() => setMessageDetails(receivedMessage)}
                className="my-3 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <h2>Message:</h2>{' '}
                  <span className="capitalize">{receivedMessage.message}</span>
                </div>
                <div className="flex items-center gap-4">
                  <small>Sender_name:</small>{' '}
                  <small>{receivedMessage.from.name}</small>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="w-full lg:w-3/12">
          <div>
            <div className="flex gap-2">
              <span>Message:</span>
              <span>{messageDetails?.message}</span>
            </div>
            <p className="flex gap-2">
              <small>Sender:</small>
              <small>{messageDetails?.from.name}</small>
            </p>
          </div>
          <div className="w-full max-w-[60rem] m-auto my-10">
            <input
              type="text"
              name="prompt"
              id="prommpt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border-2 w-full p-2 border-none outline-none rounded-lg"
            />
            <div className="flex gap-6 my-4">
              <button
                type="submit"
                className="px-6 py-2 rounded-md border bg-green-700 text-white"
              >
                Reply Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
