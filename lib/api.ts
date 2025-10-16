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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new ApiError(response.status, error.message || "An error occurred")
  }

  return response.json()
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

  answer: (sessionId: string, data: { questionId: string; answer: string; timeSpent: number }) =>
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
