"use server";
import { supabaseClient } from "@/utils/supabase/client";

export const placeBet = async (
  tournament_id: number,
  participant_id: number,
  betting_user_wallet_address: string,
  bet_amount: number
) => {
  console.log(tournament_id, participant_id, betting_user_wallet_address, bet_amount);
  const { data: existingBet, error: fetchError } = await supabaseClient
    .from("bettings")
    .select("*")
    .eq("tournament_id", tournament_id)
    .eq("participant_id", participant_id)
    .eq("betting_user_wallet_address", betting_user_wallet_address)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching existing bet:", fetchError.message);
    throw new Error(fetchError.message);
  }

  let result;

  if (existingBet) {
    const newAmount = existingBet.bet_amount + bet_amount;
    result = await supabaseClient
      .from("bettings")
      .update({ bet_amount: newAmount })
      .eq("bet_id", existingBet.bet_id);
  } else {
    result = await supabaseClient
      .from("bettings")
      .insert({ tournament_id, participant_id, betting_user_wallet_address, bet_amount });
  }

  if (result.error) {
    console.error("Error placing/updating bet:", result.error.message);
    throw new Error(result.error.message);
  }

  const { data: participant, error: participantError } = await supabaseClient
    .from("participants")
    .select("total_bet_amount")
    .eq("participant_id", participant_id)
    .single();

  if (participantError) {
    console.error("Error fetching participant:", participantError.message);
    throw new Error(participantError.message);
  }

  const newTotalBetAmount = (participant.total_bet_amount || 0) + bet_amount;
  const { error: updateError } = await supabaseClient
    .from("participants")
    .update({ total_bet_amount: newTotalBetAmount })
    .eq("participant_id", participant_id);

  if (updateError) {
    console.error("Error updating participant total:", updateError.message);
    throw new Error(updateError.message);
  }

  console.log("Bet placed/updated and participant total updated successfully");
};

export const getBetsForTournament = async (tournament_id: number) => {
  const { data, error } = await supabaseClient
    .from("bettings")
    .select("*")
    .eq("tournament_id", tournament_id);

  if (error) {
    console.error("Error fetching bets:", error.message);
    throw new Error(error.message);
  }

  return data;
};
