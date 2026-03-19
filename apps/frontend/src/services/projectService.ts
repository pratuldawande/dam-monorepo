const API_BASE = import.meta.env.VITE_API_BASE;

export interface Project {
  _id: string;
  userId?: string;
  name: string;
  description: string;
  filesCount: number;
  jobsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectReq {
  name: string;
  description: string;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectsRes {
  success: boolean;
  message: string;
  data: Project[];
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getProjects = async (): Promise<ProjectsRes> => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Projects fetch failed");
  }

  return response.json() as Promise<ProjectsRes>;
};

export const getProject = async (projectId: string): Promise<ProjectResponse> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Project fetch failed");
  }

  return response.json() as Promise<ProjectResponse>;
};

export const createProject = async (
  name: string,
  description: string,
): Promise<ProjectResponse> => {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error("Project creation failed");
  }

  return response.json() as Promise<ProjectResponse>;
};

export const updateProject = async (
  name: string,
  description: string,
  projectId: string,
): Promise<ProjectResponse> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error("Project update failed");
  }

  return response.json() as Promise<ProjectResponse>;
};

export const deleteProject = async (
  projectId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Project deletion failed");
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
};
