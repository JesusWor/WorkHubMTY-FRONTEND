import type { Achievement, Friend, UserProfile } from "./perfil.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

async function authFetch<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? `Error ${res.status}`);
  return data;
}

export const perfilApi = {
  getProfile: (token: string) =>
    authFetch<UserProfile>("/me", token),

  getFriends: (token: string) =>
    authFetch<Friend[]>("/me/friends", token),

  getAchievements: (token: string) =>
    authFetch<Achievement[]>("/me/achievements", token),
};