const API_BASE = import.meta.env.VITE_API_BASE;

export interface GetFilesRes {
  success: boolean;
  message: string;
  data: File[];
}

export interface File {
  _id: string;
  projectId: string;
  userId: string;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  isOutput: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export const getFiles = async (_id: string) => {
  const response = await fetch(`${API_BASE}/projects/${_id}/files`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Files fetch failed');
  }

  const data: GetFilesRes = await response.json();
  console.log('Files response data:', data);

  return data;
};

export const deleteFile = async (projectId: string, fileId: string) => {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('File deletion failed');
  }

  const data = await response.json();
  return data;
};

export const downloadZip = async (projectId: string, fileId: string) => {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/files/${fileId}/download`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/zip',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Download failed');
  }

  return response;
};

export const uploadFiles = async (projectId: string, files: FormData) => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: files,
  });
  if (!response.ok) {
    throw new Error('Project creation failed');
  }

  const data: GetFilesRes = await response.json();
  return data;
};
