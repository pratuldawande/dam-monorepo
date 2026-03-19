import { useQuery } from "@tanstack/react-query";
import { getAssets, type AssetQueryParams } from "../api/asset.api";

export const useAssets = (params?: AssetQueryParams) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAssets(params),
    placeholderData: (previousData) => previousData,
  });
};
