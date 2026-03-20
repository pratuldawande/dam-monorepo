import API from "./axios";

export interface Asset {
  _id: string;
  userId?: string;
  originalName?: string;
  name?: string;
  url?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface GetAssetsResponse {
  success: boolean;
  data: Asset[];
}

export interface UploadAssetsResponse {
  success: boolean;
  data: Asset[];
}

export const getAssets = (params?: AssetQueryParams) =>
  API.get<GetAssetsResponse>("/assets", { params }).then((res) => res.data);

export const uploadAssets = (files: File[]) => {
  const formData = new FormData();

  files.forEach((file: File) => formData.append("files", file));

  return API.post<UploadAssetsResponse>("/assets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
};
