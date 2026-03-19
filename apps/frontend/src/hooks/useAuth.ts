import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  loginUser,
  logoutUser,
  type AuthUser,
  type LoginRequest,
  type MeResponse,
} from "../api/auth.api";

const authUserQueryKey = ["auth-user"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: authUserQueryKey,
    queryFn: getMe,
    enabled: !!localStorage.getItem("token"), // only if token exists
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      queryClient.setQueryData<MeResponse>(authUserQueryKey, {
        success: true,
        message: data.message,
        data: data.data.user,
      });
      queryClient.invalidateQueries({ queryKey: authUserQueryKey });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: async () => {
      localStorage.removeItem("token");
      await queryClient.cancelQueries({ queryKey: authUserQueryKey });
      queryClient.removeQueries({ queryKey: authUserQueryKey });
    },
  });

  return {
    user: userQuery.data?.data as AuthUser | undefined,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!localStorage.getItem("token"),
    login: (data: LoginRequest) => loginMutation.mutateAsync(data),
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: () => logoutMutation.mutateAsync(),
    logoutLoading: logoutMutation.isPending,
  };
};
