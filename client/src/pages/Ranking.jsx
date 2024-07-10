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

  return (
    <Animation>
      <div className="col-span-4 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
        <div className="w-full max-w-md">
          <TabGroup className="rounded-xl bg-black/5">
            <TabList className="rounded-xl flex w-full justify-between gap-4 p-1">
              <Tab
                key="weekly"
                className="rounded-lg w-full py-1 px-3 text-sm/6 font-semibold  focus:outline-none text-gray-400 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Weekly
              </Tab>
              <Tab
                key="alltime"
                className="rounded-lg w-full py-1 px-3 text-sm/6 font-semibold  focus:outline-none text-gray-400 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                All-time
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel key="weekly" className="p-3">
                <div className="leaderboard">
                  <div className="grid grid-cols-4 gap-2">
                    {weeklyLeaderboard.map((entry, index) => (
                      <div
                        key={entry._id}
                        className="flex col-span-4 l gap-2 items-center justify-between p-3 rounded-md"
                      >
                        <span className="text-lg font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-lg">{entry.userId.username}</span>
                        <span className="text-lg">
                          {entry.totalPoints.toFixed(1)} points
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabPanel>
              <TabPanel key="alltime" className="p-3">
                <div className="leaderboard">
                  <div className="grid grid-cols-4 gap-2">
                    {allTimeLeaderboard.map((entry, index) => (
                      <div
                        key={entry._id}
                        className="flex col-span-4 l gap-2 items-center justify-between p-3 rounded-md"
                      >
                        <span className="text-lg font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-lg">{entry.userId.username}</span>
                        <span className="text-lg">
                          {entry.totalPoints.toFixed(1)} points
                        </span>
                      </div>
                    ))}
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
