export interface LoginResponse {
  status: number;
  data: {
    message: string;
    token: string;
  };
}
export interface SignUpResponse {
  status: number;
  data: {
    message: string;
    user: {
      id: string;
      createdAt: string;
    };
    token: string;
  };
}
