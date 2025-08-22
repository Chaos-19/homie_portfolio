import { supabase } from "./client"
import type { SiteSetting } from "./client"

export async function getSettings() {
  const { data, error } = await supabase.from("site_settings").select("*")

  if (error) {
    console.error("Error fetching settings:", error)
    return []
  }

  return data as SiteSetting[]
}

export async function getSetting(key: string) {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

  if (error) {
    console.error("Error fetching setting:", error)
    return ""
  }

  return data?.value || ""
}

export async function updateSetting(key: string, value: string) {
  const { data, error } = await supabase.from("site_settings").upsert({ key, value }).select().single()

  if (error) {
    console.error("Error updating setting:", error)
    throw error
  }

  return data as SiteSetting
}
