const API_BASE_URL = "https://dnate-backend.vercel.app/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  console.log("[v0] API Call:", {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || "GET",
    hasToken: !!token,
  })

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    console.log("[v0] API Response:", {
      url: `${API_BASE_URL}${endpoint}`,
      status: response.status,
      ok: response.ok,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      console.error("[v0] API Error:", {
        url: `${API_BASE_URL}${endpoint}`,
        status: response.status,
        error,
      })
      throw new ApiError(response.status, error.message || `API Error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("[v0] Fetch Error:", error)
    throw error
  }
}

// Auth APIs
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    fetchApi<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => fetchApi<{ user: any }>("/auth/me"),
}

// Personas APIs
export const personasApi = {
  getAll: () => fetchApi<{ personas: any[] }>("/personas"),
  getById: (id: string) => fetchApi<{ persona: any }>(`/personas/${id}`),
}

// Sessions APIs
export const sessionsApi = {
  start: (data: { personaId: string }) =>
    fetchApi<{ session: any }>("/sessions/start", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Corrected the signature to match the backend
  answer: (sessionId: string, data: { questionIndex: number; answer: string; timeTaken: number; confidence: number }) =>
    fetchApi<{ success: boolean }>(`/sessions/${sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  complete: (sessionId: string, data: { confidenceRating: number; qualityRating: number; notes?: string }) =>
    fetchApi<{ session: any; statistics: any }>(`/sessions/${sessionId}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => fetchApi<{ sessions: any[] }>("/sessions"),

  getById: (sessionId: string) => fetchApi<{ session: any }>(`/sessions/${sessionId}`),
}

// Recordings APIs
export const recordingsApi = {
  getUploadUrl: (sessionId: string, data: { fileName: string; fileType: string }) =>
    fetchApi<{ uploadUrl: string; recordingId: string }>(`/sessions/${sessionId}/recording/upload-url`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  process: (sessionId: string, data: { recordingId: string }) =>
    fetchApi<{ success: boolean }>(`/sessions/${sessionId}/recording/process`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRecording: (sessionId: string, recordingIndex: number) =>
    fetchApi<{ recording: any }>(`/sessions/${sessionId}/recording/${recordingIndex}`),

  getAll: (sessionId: string) => fetchApi<{ recordings: any[] }>(`/sessions/${sessionId}/recordings`),
}

// Questions APIs
export const questionsApi = {
  getAll: () => fetchApi<{ questions: any[] }>("/questions"),
  getById: (id: string) => fetchApi<{ question: any }>(`/questions/${id}`),
  getRandom: () => fetchApi<{ question: any }>("/questions/random"),
}

// Health check
export const healthApi = {
  check: () => fetchApi<{ status: string; database: string }>("/health"),
}
