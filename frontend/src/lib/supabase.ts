import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function recoverSession(): Promise<Session | null> {
  if (!supabase) return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.warn('Session invalid or expired, clearing localStorage...');
      await supabase.auth.signOut();
      localStorage.removeItem(`sb-${supabaseUrl?.replace(/https?:\/\//, '')}-auth-token`);
      return null;
    }

    return session;
  } catch (err) {
    console.error('Error recovering session:', err);
    return null;
  }
}

export async function clearInvalidSession(): Promise<void> {
  if (!supabase) return;

  try {
    await supabase.auth.signOut();
    localStorage.removeItem(`sb-${supabaseUrl?.replace(/https?:\/\//, '')}-auth-token`);
  } catch (err) {
    console.error('Error clearing session:', err);
  }
}
