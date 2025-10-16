import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    const body = await request.json();

    const apiRes = await fetch(`${API_BASE_URL}/api/sessions/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return new Response(JSON.stringify(data), { status: apiRes.status });
    }

    return new Response(JSON.stringify(data), { status: 201 });

  } catch (error) {
    console.error('Start session error:', error);
    return new Response(JSON.stringify({ error: 'Failed to start a new session' }), { status: 500 });
  }
}