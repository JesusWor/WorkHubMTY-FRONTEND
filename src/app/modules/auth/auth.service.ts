import { postData, getMe } from "./api";
import type { AuthResponse, LoginInput, User } from "./auth.types";

export const authService = {
  login(data: LoginInput) {
    return postData<AuthResponse>("/auth/login", data);
  },
  me(): Promise<User> {
    return getMe();
  },

};
