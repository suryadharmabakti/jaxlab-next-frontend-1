// src/services/api.ts
const API_URL = 'https://toko.tetrabit.my.id/api';

const api = {
  // Login
  login: async (email: string, password: string) => {
    const credentials = btoa(`${email}:${password}`);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },


  // Register
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }
};

export default api;
