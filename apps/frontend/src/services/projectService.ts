const API_BASE = import.meta.env.VITE_API_BASE;

export interface ProjectsRes {
  success: boolean;
  message: string;
  data: Project[];
}
export interface ProjectRes {
  success: boolean;
  message: string;
  data: Project;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  filesCount: number;
  jobsCount: number;
}

export interface CreateProjectReq {
  name: string;
  description: string;
}

export const getProject = async (_id: string) => {
  const response = await fetch(`${API_BASE}/projects/${_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Projects fetch failed');
  }

  const data: ProjectRes = await response.json();
  console.log('Projects response data:', data);

  return data;
};

export const getProjects = async () => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Projects fetch failed');
  }

  const data: ProjectsRes = await response.json();
  console.log('Projects response data:', data);

  return data;
};

export const createProject = async (name: string, description: string) => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error('Project creation failed');
  }

  const data = await response.json();
  return data;
};

export const updateProject = async (
  name: string,
  description: string,
  _id: string
) => {
  const response = await fetch(`${API_BASE}/projects/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error('Project update failed');
  }

  const data = await response.json();
  return data;
};

export const deleteProject = async (_id: string) => {
  const response = await fetch(`${API_BASE}/projects/${_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Project deletion failed');
  }

  const data = await response.json();
  return data;
};
