const API_BASE = import.meta.env.VITE_API_BASE;

export interface LoginRes {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log('Login response status:', email, password, response);
  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data: LoginRes = await response.json();
  console.log('Login response data:', data);

  localStorage.setItem('token', data.data.token);

  return data;
};
