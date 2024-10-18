"use server";
import { supabaseClient } from "@/utils/supabase/client";

export const createTournament = async (
  tournamentId: number,
  owner_wallet: string,
  game_description: string,
  name: string,
  description: string,
  deadline: number,
  maxPlayers: number,
  reward: string,
  prizeDistribution: string[],
  streaming_link: string
): Promise<number> => {

  console.log(deadline);

  const formattedPrizeDistribution = `{${prizeDistribution.join(", ")}}`;

  const { data, error } = await supabaseClient
    .from("tournaments")
    .insert({
      tournament_id: tournamentId,
      owner_wallet,
      game_description,
      name,
      description,
      deadline,
      max_players: maxPlayers,
      reward,
      prize_distribution: formattedPrizeDistribution,
      total_pool: 0,
      settled: false,
      streaming_link
    })
    .select('tournament_id');

  if (error) {
    console.log(error)
    console.error("Error creating tournament:", error.message);
    throw new Error(error.message);
  }

  return data[0].tournament_id;
};


export const getAllTournaments = async (): Promise<Tournament[]> => {
  const { data, error } = await supabaseClient.from("tournaments").select("*");

  if (error) {
    console.error("Error fetching tournaments:", error.message);
    throw new Error(error.message);
  }

  return data as Tournament[];
};

export const getTournamentOwner = async (tournamentId: number): Promise<string | null> => {
  const { data, error } = await supabaseClient
    .from("tournaments")
    .select("owner_wallet")
    .eq("tournament_id", tournamentId)
    .single();
    
    console.log(data);

  if (error) {
    console.error("Error fetching tournament owner:", error.message);
    return null;
  }

  return data?.owner_wallet || null;
};

export const settleTournament = async (tournamentId: number, winnerAddress: string) => {
  console.log(winnerAddress);
  const { error } = await supabaseClient
    .from("tournaments")
    .update({ settled: true, winner_wallet: winnerAddress })
    .eq("tournament_id", tournamentId);

  if (error) {
    console.error("Error settling tournament:", error.message);
    throw new Error(error.message);
  }

  console.log("Tournament settled successfully in database");
};
