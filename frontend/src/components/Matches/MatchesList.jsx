import React, { useContext, useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import { UserContext } from "../UserContext"; // Adjust the import path as necessary

const VERCEL_URL = import.meta.env.VITE_VERCEL_URL;
const matchesLink = `${VERCEL_URL}/api/matches`;

const MatchesList = () => {
  const { activeUser } = useContext(UserContext);
  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchMatches = async () => {
      if (!activeUser) {
        setLoading(false);
        return;
      }

      try {
        // Fetch matches from the API
        const response = await fetch(matchesLink);
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const matches = await response.json();

        // Debug: Log the fetched matches
        console.log("Fetched Matches:", matches);

        // Filter matches where user_1_id matches the active user's ID and status is "pending"
        const filteredMatches = matches.filter(
          (match) =>
            match.user_1_id === activeUser.user_data_id && match.status === "pending"
        );

        // Debug: Log the filtered matches
        console.log("Filtered Matches:", filteredMatches);

        setAcceptedMatches(filteredMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMatches();
  }, [activeUser]);

  if (!activeUser) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading matches...</div>; // Show a loading message while fetching
  }

  return (
    <section className="flex-1 p-8 max-sm:p-4 overflow-y-auto max-h-[800px] p-4 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <h1 className="mb-10 text-4xl font-bold text-white max-sm:mb-5 max-sm:text-3xl">
        Your Matches
      </h1>
      <div className="flex flex-col gap-4">
        {acceptedMatches.length > 0 ? (
          acceptedMatches.map((match) => (
            <MatchCard key={match.match_id} {...match} />
          ))
        ) : (
          <p className="text-white">No pending matches found.</p>
        )}
      </div>
    </section>
  );
};

export default MatchesList;