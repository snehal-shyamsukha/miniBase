"use server";

import { supabaseClient } from "@/utils/supabase/client";

export const checkParticipantExists = async (
  tournament_id: number,
  user_wallet: string
): Promise<boolean> => {
  console.log(tournament_id, user_wallet);
  const { data, error } = await supabaseClient
    .from("participants")
    .select("*")
    .eq("tournament_id", tournament_id)
    .eq("user_wallet", user_wallet)
    .single();

  console.log(data);
  if (error && error.code !== 'PGRST116') {
    console.error("Error checking participant:", error.message);
    throw new Error(error.message);
  }

  return !!data;
};

export const addParticipantToTournament = async (
  tournament_id: number,
  participant: string
): Promise<{ success: boolean; message: string }> => {
  const participantExists = await checkParticipantExists(tournament_id, participant);

  if (participantExists) {
    return { success: false, message: "Participant already exists in the tournament" };
  }

  const { data, error } = await supabaseClient
    .from("participants")
    .insert({
      tournament_id,
      user_wallet: participant,
      total_bet_amount: 0
    });

  if (error) {
    console.error("Error adding participant:", error.message);
    return { success: false, message: error.message };
  }

  console.log("Participant added to tournament:", data);
  return { success: true, message: "Participant added successfully" };
};

export const getAllParticipants = async (tournament_id: number) => {
  console.log(tournament_id)
  const { data, error } = await supabaseClient
    .from("participants")
    .select("*")
    .eq("tournament_id", tournament_id);
  console.log(data);

  if (error) {
    console.error("Error fetching participants:", error.message);
    throw new Error(error.message);
  }

  return data;
};


