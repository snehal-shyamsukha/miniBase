"use server";
import { supabaseClient } from "@/utils/supabase/client";

export const createTournament = async (
  name: string,
  owner_wallet: string,
  description: string,
  deadline: string
): Promise<number> => {
  const { data, error } = await supabaseClient
    .from("Tournaments")
    .insert([{ name, owner_wallet, description, deadline, total_pool: 0, settled: false }])
    .select('tournament_id');

  if (error) {
    console.error("Error creating tournament:", error.message);
    throw new Error(error.message);
  }

  return data[0].tournament_id;
};

export const getAllTournaments = async () => {
  const { data, error } = await supabaseClient.from("Tournaments").select("*");

  if (error) {
    console.error("Error fetching tournaments:", error.message);
    throw new Error(error.message);
  }

  return data;
};
