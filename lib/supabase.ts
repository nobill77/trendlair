import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Item = {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  github_url: string;
  image: string;
  tags: string[];
  trend_score: number;
  slug: string;
  stars?: number;
  votes?: number;
  source?: string;
  thumbnail?: string;
  created_at: string;
};
};
