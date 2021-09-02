export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: [],
    };
    newConvo.latestMessageText = message.text;
    // If the other user sent the message we add to unreadmessages
    if (newConvo.otherUser.id === message.senderId) {
      newConvo.unreadMessages.push(message);
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
        convoCopy.unreadMessages.push(message);
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
      convoCopy.unreadMessages= [];
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
        }

        const readMessageIndex = convo.unreadMessages.findIndex((msg) => {
          return msg.id === message.id;
        });

        // Remove messages from unreadMessages if there is a match
        if (readMessageIndex >= 0) {
          convo.unreadMessages.splice(readMessageIndex, 1);
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
