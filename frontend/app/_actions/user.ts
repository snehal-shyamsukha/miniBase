"use server";
import { supabaseClient } from "@/utils/supabase/client";

export const createUser = async (wallet_address: string, username?: string): Promise<number> => {
  const { data: existingUser, error: checkError } = await supabaseClient
    .from("Users")
    .select("user_id")
    .eq("wallet_address", wallet_address)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking user:", checkError.message);
    throw new Error(checkError.message);
  }

  if (existingUser) {
    return existingUser.user_id;
  }

  const { data, error } = await supabaseClient
    .from("Users")
    .insert([{ wallet_address, username }])
    .select('user_id');

  if (error) {
    console.error("Error creating user:", error.message);
    throw new Error(error.message);
  }

  return data[0].user_id;
};
