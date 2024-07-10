import Leaderboard from "../models/leaderboard.model.js";
import User from "../models/user.models.js";
import moment from "moment";

// Pobierz wszystkie wpisy z leaderboard z uwzględnieniem rankingu
export const getAllLeaderboardEntries = async (req, res) => {
  try {
    // Pobierz wszystkie wpisy z leaderboard, posortowane malejąco wg totalPoints
    const leaderboardEntries = await Leaderboard.find()
      .populate("userId", "username profilePhoto")
      .sort({ totalPoints: -1 });

    // Oblicz rank dla każdego użytkownika
    let rank = 1;
    const leaderboardEntriesWithRank = leaderboardEntries.map((entry) => ({
      ...entry.toObject(),
      rank: rank++,
    }));

    res.status(200).json(leaderboardEntriesWithRank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch weekly leaderboard entries
export const getWeeklyLeaderboardEntries = async (req, res) => {
  try {
    const startOfWeek = moment().startOf("week"); // Start of current week
    const endOfWeek = moment().endOf("week"); // End of current week

    const leaderboardEntries = await Leaderboard.find({
      createdAt: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    })
      .populate("userId", "username profilePhoto")
      .sort({ totalPoints: -1 });

    res.status(200).json(leaderboardEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pobierz wpis użytkownika z leaderboard
export const getLeaderboardEntryByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const leaderboardEntry = await Leaderboard.findOne({ userId }).populate(
      "userId",
      "username profilePhoto"
    );

    if (!leaderboardEntry) {
      return res.status(404).json({ error: "Leaderboard entry not found" });
    }

    res.status(200).json(leaderboardEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
