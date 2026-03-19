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
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getFiles = async (projectId: string): Promise<GetFilesRes> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/files`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Files fetch failed");
  }

  return response.json() as Promise<GetFilesRes>;
};

export const deleteFile = async (
  projectId: string,
  fileId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/files/${fileId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("File deletion failed");
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
};

export const downloadZip = async (
  projectId: string,
  fileId: string,
): Promise<Response> => {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/files/${fileId}/download`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/zip",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Download failed");
  }

  return response;
};

export const uploadFiles = async (
  projectId: string,
  files: FormData,
): Promise<GetFilesRes> => {
  const response = await fetch(`${API_BASE}/projects/${projectId}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: files,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json() as Promise<GetFilesRes>;
};
