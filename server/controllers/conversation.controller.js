import Conversation from "../models/conversation.model.js";

// Utwórz nową konwersację
export const createConversation = async (req, res) => {
  const { participants } = req.body;

  try {
    const conversation = new Conversation({ participants });
    const savedConversation = await conversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Pobierz konwersacje użytkownika
export const getConversationsByUserId = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
