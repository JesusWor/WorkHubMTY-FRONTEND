export interface User {
  eid: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  eid: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
