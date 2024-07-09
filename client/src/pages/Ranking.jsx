import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Animation from "../components/Animation";

const Ranking = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const [leaders, setLeaders] = useState({ podium: [], others: [] });
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const endpoint =
          activeTab === "weekly"
            ? "/api/user/ranking/weekly"
            : "/api/user/ranking/allTime";

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Dodaj tutaj nagłówek z tokenem autoryzacyjnym, jeśli jest wymagany
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Sprawdź, czy dane zawierają oczekiwane pola
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format from server");
        }

        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaders:", error.message);
      }
    }

    fetchLeaders();
  }, [activeTab]);

  console.log("Leaders state:", leaders);

  return (
    <Animation>
      <h2 className="text-2xl font-semibold mb-6">Leaderboard</h2>
      <div className="mb-4 p-1 mx-auto flex justify-center bg-gray-100 rounded-full">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`animate duration-200 w-full px-4 py-1 font-semibold rounded-2xl ${
            activeTab === "weekly"
              ? "bg-indigo-200 text-indigo-800"
              : "bg-transparent"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab("all-time")}
          className={`animate duration-200 w-full px-4 py-1 font-semibold rounded-2xl ${
            activeTab === "all-time"
              ? "bg-indigo-200 text-indigo-800"
              : "bg-transparent "
          }`}
        >
          All time
        </button>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {leaders.podium &&
            leaders.podium.map((person, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <span>{index + 1}</span>
                  <img
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                    src=""
                    alt="Profile Photo"
                  />
                  <div className="flex flex-col">
                    <span className="text-md font-bold"></span>
                    <span className="text-sm text-gray-500 font-semibold">
                      {person.quizzesTaken} quizzes taken,{" "}
                      {person.averageScore.toFixed(2)} average score
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          {leaders.others &&
            leaders.others.map((person, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <span>{index + 4}</span>
                  <img
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                    src=""
                    alt="Profile Photo"
                  />
                  <div className="flex flex-col">
                    <span className="text-md font-bold"></span>
                    <span className="text-sm text-gray-500 font-semibold">
                      {person.quizzesTaken} quizzes taken,{" "}
                      {person.averageScore.toFixed(2)} average score
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Animation>
  );
};

export default Ranking;
