"use server"
import { supabaseClient } from "@/utils/supabase/client";

export const getAllGames = async (): Promise<Game[]> => {
    const { data, error } = await supabaseClient
        .from('games')
        .select('*');

    if (error) {
        console.error("Error fetching games:", error);
        throw error;
    }
    console.log(data);
    return data as Game[];
};

