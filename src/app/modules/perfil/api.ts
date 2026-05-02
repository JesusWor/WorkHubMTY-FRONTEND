import type { Achievement, Friend, UserProfile } from "./perfil.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

async function authFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? `Error ${res.status}`);
  return data;
}

export const perfilApi = {
  getProfile: () =>
    authFetch<UserProfile>("/me"),

  getFriends: () =>
    authFetch<Friend[]>("/friendships/me"),

  getAchievements: () =>
    authFetch<Achievement[]>("/achievements/me"),
};