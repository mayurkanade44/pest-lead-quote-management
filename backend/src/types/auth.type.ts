export interface LoginResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
