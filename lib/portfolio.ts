import { supabase } from "./client"
import type { PortfolioItem } from "./client"

export async function getPortfolioItems() {
  const { data, error } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching portfolio items:", error)
    return []
  }

  return data as PortfolioItem[]
}

export async function getFeaturedPortfolioItems() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured portfolio items:", error)
    return []
  }

  return data as PortfolioItem[]
}

export async function createPortfolioItem(item: Omit<PortfolioItem, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("portfolio_items").insert([item]).select().single()

  if (error) {
    console.error("Error creating portfolio item:", error)
    throw error
  }

  return data as PortfolioItem
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  const { data, error } = await supabase.from("portfolio_items").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating portfolio item:", error)
    throw error
  }

  return data as PortfolioItem
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id)

  if (error) {
    console.error("Error deleting portfolio item:", error)
    throw error
  }
}
