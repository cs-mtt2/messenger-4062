export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: 0,
    };
    newConvo.latestMessageText = message.text;
    // If the other user sent the message we add to unreadmessages
    if (newConvo.otherUser.id === message.senderId) {
      newConvo.unreadMessages += 1;
    }
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      // Since we are updating state we need to copy convo and mutate it
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      // If the other user sent the message we add to unreadmessages
      if (convo.otherUser.id === message.senderId) {
        convoCopy.unreadMessages += 1;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      // Since we are updating state we need to copy convo and mutate it
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadMessages= 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateMessageReadToStore = (state, messages) => {
  return state.map((convo) => {
    if (messages[0] && convo.id === messages[0].conversationId) {
      // Since we are updating state we need to copy convo and mutate it
      const convoCopy = { ...convo };

      messages.forEach((message) => {
        const foundMessage = convoCopy.messages.find((msg) => {
          return msg.id === message.id;
        });
        
        // Update locally for all messages that have been read by other clients
        if (foundMessage) {
          foundMessage.readByRecipient = true;
          // Decrement our unreadmessage count and clamp at zero to prevent negative unread messages
          convoCopy.unreadMessages = convoCopy.unreadMessages > 0 ? convoCopy.unreadMessages - 1 : 0;
        }
        
        // Update the lastMessageOtherRead if they read a message in this event
        if (convoCopy.otherUser.id !== message.senderId) {
          convoCopy.lastMessageOtherRead = foundMessage;
        }
      });

      return convoCopy;
    } else {
      return convo;
    }
  });
};
