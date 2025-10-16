import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    const apiRes = await fetch(`${API_BASE_URL}/api/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await apiRes.json();

    if (!apiRes.ok) {
      return new Response(JSON.stringify(data), { status: apiRes.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error('Fetch sessions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch sessions' }), { status: 500 });
  }
}