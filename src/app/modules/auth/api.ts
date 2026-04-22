const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function postData<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${response.status} al hacer POST`);
  }
  return data;
}

export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `${response.status} al hacer POST`);
  }
  console.log(data);

  return data;
}
