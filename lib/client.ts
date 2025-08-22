import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  image_url: string
  project_url?: string
  github_url?: string
  status: "draft" | "published"
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description: string
  skills: string[]
  type: "work" | "freelance" | "education"
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}
