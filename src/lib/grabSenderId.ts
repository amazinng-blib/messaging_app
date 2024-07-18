export interface MessageData {
  recipient: { id: string };
  message: { text: string };
}

let messageDataFromHook: MessageData = {
  recipient: { id: '' },
  message: { text: '' },
};

export const grabSenderId = (data: MessageData) => {
  if (data) {
    messageDataFromHook = data;
    console.log('function', messageDataFromHook);
  }
  return data;
};

export const receivedWebhookMessages = () => {
  // if (messageDataFromHook.message && messageDataFromHook.recipient) {
  //   console.log('sub-func', messageDataFromHook);
  //   return messageDataFromHook;
  // } else {
  //   console.log('Message is empty', messageDataFromHook);
  // }

  console.log('sub-func', messageDataFromHook);
  return messageDataFromHook;
};

console.log('outside', messageDataFromHook);
