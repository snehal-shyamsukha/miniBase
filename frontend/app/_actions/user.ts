"use server";
import { supabaseClient } from "@/utils/supabase/client";
export const createUser = async (wallet_address: string): Promise<number> => {
  console.log(wallet_address)
  const { data: existingUser, error: checkError } = await supabaseClient
    .from("users")
    .select("user_id")
    .eq("wallet_address", wallet_address)
    .single();
    console.log(existingUser);

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking user:", checkError.message);
    throw new Error(checkError.message);
  }

  if (existingUser) {
    return existingUser.user_id;
  }

  const { data, error } = await supabaseClient
    .from("users")
    .insert({wallet_address: wallet_address})
    .select('user_id');

  if (error) {
    console.error("Error creating user:", error.message);
    throw new Error(error.message);
  }

  return data[0].user_id;
};
