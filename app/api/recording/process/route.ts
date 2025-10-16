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
    const { sessionId, s3Key, duration, questionIndex } = body;

    if (!sessionId || !s3Key || questionIndex === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const apiRes = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/recording/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ s3Key, duration, questionIndex }),
    });
    
    const data = await apiRes.json();
    if (!apiRes.ok) {
      return new Response(JSON.stringify(data), { status: apiRes.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process recording' }), { status: 500 });
  }
}