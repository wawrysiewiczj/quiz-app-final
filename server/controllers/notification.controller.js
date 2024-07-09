import Notification from "../models/notification.model.js";

// Pobierz powiadomienia użytkownika
export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
