import { createClient } from "@supabase/supabase-js";

const supabaseUrl = ((import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || "").trim();
const supabaseAnonKey = ((import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || "").trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-supabase-url"),
);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);
