import { supabase } from "./client";
import type { Experience } from "./client";

export async function getExperience() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching experience:", error);
    return [];
  }

  return data as Experience[];
}

export async function createExperience(
  experience: Omit<Experience, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("experience")
    .insert([
      {
        ...experience,
        start_date: new Date(experience.start_date),
        end_date: new Date((experience?.end_date as string) || ""),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating experience:", error);
    throw error;
  }

  return data as Experience;
}

export async function updateExperience(
  id: string,
  updates: Partial<Experience>
) {
  const { data, error } = await supabase
    .from("experience")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating experience:", error);
    throw error;
  }

  return data as Experience;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}
