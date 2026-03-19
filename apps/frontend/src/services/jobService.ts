const API_BASE = import.meta.env.VITE_API_BASE;

export interface Job {
  _id: string;
  projectId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  outputFileId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getJobs = async (projectId: string): Promise<JobsResponse> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/jobs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Jobs fetch failed");
  }

  return response.json() as Promise<JobsResponse>;
};

export const createJob = async (
  projectId: string,
  fileIds: string[],
): Promise<JobResponse> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ fileIds }),
  });

  if (!response.ok) {
    throw new Error("Job creation failed");
  }

  return response.json() as Promise<JobResponse>;
};
