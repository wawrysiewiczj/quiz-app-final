import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Utwórz nową wiadomość
export const createMessage = async (req, res) => {
  const { conversationId, senderId, content } = req.body;

  try {
    const message = new Message({
      conversationId,
      senderId,
      content,
    });

    const savedMessage = await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        timestamp: message.timestamp,
      },
      updatedAt: Date.now(),
    });

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Pobierz wiadomości dla danej konwersacji
export const getMessagesByConversationId = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
