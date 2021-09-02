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
router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { messages } = req.body;

    console.log("BODY", req.body);
    const messageIds = messages.map((message) => {
      return message.id;
    });

    // Returns amount of rows updated and the message that was updated in the form of array [rowsUpdated, Message]
    const updateArray = await Message.update(
      { readByRecipient: true },
      { returning: true, where: { id: messageIds } }
    );

    const jsonToReturn = {
      messages: updateArray[1],
    };

    console.log("server", updateArray);

    res.json(jsonToReturn);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
