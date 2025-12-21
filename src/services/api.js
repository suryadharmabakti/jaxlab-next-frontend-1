const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = {
login: async (email, password) => {
  const url = `${API_BASE_URL}/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }

  console.log('LOGIN URL:', url);
  console.log('LOGIN STATUS:', response.status);
  console.log('LOGIN RESPONSE:', data);

  if (!response.ok) {
    throw new Error((data && (data.message || data.error || data.detail)) || `Login gagal (HTTP ${response.status})`);
  }
  return data;
},

  getProjects: async (token) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  createProject: async (token, projectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    return response.json();
  },

  uploadDocument: async (token, projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  sendMessage: async (token, projectId, message) => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ project_id: projectId, message })
    });
    return response.json();
  }
};

export default api; // ✅ INI YANG KURANG
