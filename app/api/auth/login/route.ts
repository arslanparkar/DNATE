const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return new Response(JSON.stringify(data), { status: apiRes.status });
    }

    const { token, user } = data;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    };

    // Correctly format the Set-Cookie header
    const cookieString = `token=${token}; HttpOnly; Path=/; Max-Age=${cookieOptions.maxAge}; SameSite=Lax${cookieOptions.secure ? '; Secure' : ''}`;

    const response = new Response(JSON.stringify({ user }), {
      status: 200,
      headers: {
        'Set-Cookie': cookieString,
      },
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred during login' }), { status: 500 });
  }
}