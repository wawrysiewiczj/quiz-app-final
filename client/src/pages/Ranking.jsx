import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Animation from "../components/Animation";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const Ranking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const responseAllTime = await fetch("/api/leaderboard"); // Fetch all-time leaderboard data
        if (!responseAllTime.ok) {
          throw new Error("Failed to fetch all-time leaderboard data");
        }
        const dataAllTime = await responseAllTime.json();
        setAllTimeLeaderboard(dataAllTime);

        const responseWeekly = await fetch("/api/leaderboard/weekly"); // Fetch weekly leaderboard data
        if (!responseWeekly.ok) {
          throw new Error("Failed to fetch weekly leaderboard data");
        }
        const dataWeekly = await responseWeekly.json();
        setWeeklyLeaderboard(dataWeekly);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  if (error) {
    return <p>Error fetching leaderboard: {error}</p>;
  }

  const renderPodium = (leaderboard) => {
    const podiumOrder = [1, 0, 2];
    const podiumHeights = ["80px", "100px", "60px"];
    const podiumColors = ["bg-gray-400", "bg-yellow-500", "bg-yellow-800"];
    return (
      <div className="flex justify-center gap-2 mb-6 items-end">
        {podiumOrder.map((position, index) => (
          <div key={leaderboard[position]._id} className="w-full mt-2">
            <div className="flex flex-col items-center">
              {index === 1 ? "👑" : ""}
              {leaderboard[position].userId.profilePhoto ? (
                <img
                  src={leaderboard[position].userId.profilePhoto}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              )}
              <span className="text-sm font-semibold">
                {leaderboard[position].userId.username}
              </span>
              <span className="text-sm">
                {leaderboard[position].totalPoints.toFixed(1)} pts
              </span>
            </div>
            <div
              className={`flex flex-col items-center justify-center w-full mx-1 p-2 rounded-t-lg ${podiumColors[index]}`}
              style={{ height: podiumHeights[index] }}
            >
              <span className="text-3xl font-bold">{position + 1}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeaderboardEntries = (leaderboard) => {
    return leaderboard.slice(3).map((entry, index) => (
      <div
        key={entry._id}
        className="flex col-span-4 gap-2 items-center justify-between p-3 rounded-md"
      >
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">{index + 4}</span>
          {entry.userId.profilePhoto ? (
            <img
              src={entry.userId.profilePhoto}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          )}
          <span className="text-md">{entry.userId.username}</span>
        </div>
        <span className="text-sm">{entry.totalPoints.toFixed(1)} pts</span>
      </div>
    ));
  };

  return (
    <Animation>
      <div className="col-span-4 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
        <div className="w-full max-w-md">
          <TabGroup className="rounded-xl bg-black/5">
            <TabList className="rounded-xl flex w-full justify-between gap-4 p-1">
              <Tab
                key="weekly"
                className="rounded-lg w-full py-1 px-3 text-sm font-semibold focus:outline-none text-gray-400 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Weekly
              </Tab>
              <Tab
                key="alltime"
                className="rounded-lg w-full py-1 px-3 text-sm font-semibold focus:outline-none text-gray-400 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                All-time
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel key="weekly" className="p-3">
                <div className="leaderboard">
                  {weeklyLeaderboard.length >= 3 &&
                    renderPodium(weeklyLeaderboard)}
                  <div className="grid grid-cols-4 gap-2">
                    {renderLeaderboardEntries(weeklyLeaderboard)}
                  </div>
                </div>
              </TabPanel>
              <TabPanel key="alltime" className="p-3">
                <div className="leaderboard">
                  {allTimeLeaderboard.length >= 3 &&
                    renderPodium(allTimeLeaderboard)}
                  <div className="grid grid-cols-4 gap-2">
                    {renderLeaderboardEntries(allTimeLeaderboard)}
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </Animation>
  );
};

export default Ranking;
