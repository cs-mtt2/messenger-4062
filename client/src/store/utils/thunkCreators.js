import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  updateMessagesRead,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");

    data.forEach((convo) => {
      // Sort all conversations by earliest message to latest message
      convo.messages.sort((messageA, messageB) => {
        if (messageA.createdAt < messageB.createdAt) return -1;
        else if (messageA.createdAt > messageB.createdAt) return 1;
        else return 0;
      });
      // Look for all messages that hasn't been read by us
      const messagesNotRead = convo.messages.filter((message) => {
        return (
          message.senderId === convo.otherUser.id &&
          message.readByRecipient === false
        );
      });

      // Look for the all messages that has been read by otherUser
      const messagesRead = convo.messages.filter((message) => {
        return (
          message.senderId !== convo.otherUser.id &&
          message.readByRecipient === true
        );
      });

      // cache the messages that haven't been read
      convo.unreadMessages = messagesNotRead;
      // cache the last message read by otherUser
      convo.lastMessageOtherRead =
        messagesRead.length > 0 ? messagesRead[messagesRead.length - 1] : null;
    });

    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    // Need to wait for results to dispatch so we need this function to be asynchronous
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

const readMessages = (messages) => {
  socket.emit("read-messages", messages);
  console.log("emitting read messages", messages);
};

// format to send: {messages}
// array of type message
export const putMessageRead = (body) => async (dispatch) => {
  try {
    const { data } = await axios.put("/api/messages", body);
    const { messages } = data;

    if (messages.length > 0) {
      dispatch(updateMessagesRead(messages));
      readMessages(messages);
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
