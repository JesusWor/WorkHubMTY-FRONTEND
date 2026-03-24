import { postData } from "./api";
import type { AuthResponse, LoginInput } from "./auth.types";

export const authService = {
  login(data: LoginInput) {
    return postData<AuthResponse>("/login", data);
  },
};
