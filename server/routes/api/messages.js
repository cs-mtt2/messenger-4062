const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
        readByReceipient: false,
      });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      readByReceipient: false,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// expects { messages } in body
router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { id } = req.user;
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.sendStatus(400);
    }

    let conversation = await Conversation.findByPk(conversationId);

    let otherUserId = conversation.user1Id === id ? conversation.user2Id : conversation.user1Id;

    // Only allow users that are in the conversation to read messages
    if (conversation.user1Id !== id && conversation.user2Id !== id){
      return res.sendStatus(401);
    }

    // Returns amount of rows updated and the message that was updated in the form of array [rowsUpdated, Message]
    const updateArray = await Message.update(
      { readByRecipient: true },
      { returning: true, where: { conversationId: conversationId, senderId: otherUserId, readByRecipient: false } }
    );

    const jsonToReturn = {
      messages: updateArray[1],
    };

    res.json(jsonToReturn);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
