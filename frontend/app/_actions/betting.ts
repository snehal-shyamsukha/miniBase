"use server";
import { supabaseClient } from "@/utils/supabase/client";

export const placeBet = async (
  tournament_id: number,
  participant_id: number,
  bettor_user_id: number,
  bet_amount: number
) => {
  const { data, error } = await supabaseClient
    .from("Bettings")
    .insert([{ tournament_id, participant_id, bettor_user_id, bet_amount }]);

  if (error) {
    console.error("Error placing bet:", error.message);
    throw new Error(error.message);
  }

  console.log("Bet placed successfully:", data);
};

export const getBetsForTournament = async (tournament_id: number) => {
  const { data, error } = await supabaseClient
    .from("Bettings")
    .select("*")
    .eq("tournament_id", tournament_id);

  if (error) {
    console.error("Error fetching bets:", error.message);
    throw new Error(error.message);
  }

  return data;
};
