import { supabase } from '../lib/supabase';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function buildHeaders(): Promise<Record<string, string>> {
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

  return headers;
}

async function parseError(response: Response): Promise<string> {
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
  return detail ? `API Error: ${detail}` : `API Error: ${response.status} ${response.statusText}`;
}

export async function postData(endpoint: string, data: any) {
  const headers = await buildHeaders();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function getData(endpoint: string) {
  const headers = await buildHeaders();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
