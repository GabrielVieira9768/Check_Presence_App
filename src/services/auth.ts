// src/services/auth.ts

import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  registration: string;
  // outros campos que quiser...
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function loginApi(registration: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/login', { registration, password });
  return response.data;
}
