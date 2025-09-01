export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: 'viewer' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}