"use server";

import { supabaseClient } from "@/utils/supabase/client";

export const addParticipantToTournament = async (
  tournament_id: number,
  user_id: number
) => {
  const { data, error } = await supabaseClient
    .from("Participants")
    .insert([{ tournament_id, user_id, total_bet_amount: 0 }]);

  if (error) {
    console.error("Error adding participant:", error.message);
    throw new Error(error.message);
  }

  console.log("Participant added to tournament:", data);
};

export const getAllParticipants = async (tournament_id: number) => {
  const { data, error } = await supabaseClient
    .from("Participants")
    .select("*")
    .eq("tournament_id", tournament_id);

  if (error) {
    console.error("Error fetching participants:", error.message);
    throw new Error(error.message);
  }

  return data;
};
