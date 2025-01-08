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
  isAdmin?: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
}

export interface Admin extends User {
  role: "admin";
  isActive: boolean;
}
