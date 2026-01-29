import { supabase } from '../lib/supabase';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function postData(endpoint: string, data: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (supabase) {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const body = await response.json();
        if (body?.detail) detail = String(body.detail);
      } else {
        detail = await response.text();
      }
    } catch {
      // ignore
    }
    throw new Error(detail ? `API Error: ${detail}` : `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
