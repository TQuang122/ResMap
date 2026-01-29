import { supabase } from '../lib/supabase';

type HistoryPayload = {
  tool: 'topic' | 'writing' | 'plagiarism' | 'citation';
  request: Record<string, unknown>;
  response: Record<string, unknown>;
};

export async function logHistory({ tool, request, response }: HistoryPayload) {
  if (!supabase) return;

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) return;

  await supabase.from('history_logs').insert({
    user_id: userId,
    tool,
    request,
    response,
  });
}
