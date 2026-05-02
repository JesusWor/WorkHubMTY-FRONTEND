const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function postData<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${response.status} al hacer POST`);
  }
  return data;
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `${response.status} al hacer POST`);
  }
  const user = data.data;

  return user;
}

export async function postLogout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}