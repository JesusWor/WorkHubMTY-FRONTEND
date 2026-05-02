import type { Achievement, Friend, UserProfile } from "./perfil.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

async function authFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.message ?? `Error ${res.status}`);
  return payload.data as T;
}

export const perfilApi = {
  getProfile: () =>
    authFetch<UserProfile>("/users/profile"),

  getFriends: () =>
    authFetch<Friend[]>("/friendships/me"),

  getAchievements: () =>
    authFetch<Achievement[]>("/achievements/me"),
};