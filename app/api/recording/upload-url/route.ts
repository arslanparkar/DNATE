import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID is required' }), { status: 400 });
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/recording/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fileType: 'video/webm' }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return new Response(JSON.stringify(data), { status: apiRes.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get upload URL' }), { status: 500 });
  }
}