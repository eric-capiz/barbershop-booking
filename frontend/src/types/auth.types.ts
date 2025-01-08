export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "user" | "admin";
}
