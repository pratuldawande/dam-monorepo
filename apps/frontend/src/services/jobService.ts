const API_BASE = import.meta.env.VITE_API_BASE;

export interface GetJobRes {
  success: boolean;
  message: string;
  data: Job[];
}

export interface CreateJobRes {
  success: boolean;
  message: string;
  data: Job;
}

export interface Job {
  _id: string;
  projectId: string;
  userId: string;
  type: string;
  status: string;
  progress: number;
  fileIds: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  outputFileId: string;
}
export const getJobs = async (_id: string) => {
  const response = await fetch(`${API_BASE}/projects/${_id}/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Files fetch failed');
  }

  const data: GetJobRes = await response.json();
  console.log('Jobs response data:', data);

  return data;
};

export const getJob = async (projectId: string, jobId: string) => {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/jobs/${jobId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Job fetch failed');
  }

  const data = await response.json();
  return data;
};

export const createJob = async (projectId: string, fileIds: string[]) => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/jobs/zip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ fileIds }),
  });
  if (!response.ok) {
    throw new Error('Job creation failed');
  }

  const data: CreateJobRes = await response.json();
  return data;
};
