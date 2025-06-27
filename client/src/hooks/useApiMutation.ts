import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
  code?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

interface MutationConfig<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
  showSuccessToast?: boolean | "response" | string;
  showErrorToast?: boolean | "response" | string;
  invalidateQueries?: string[];
  setQueryData?: { key: string[]; dataExtractor: (data: TData) => any };
}

export function useApiMutation<TData extends ApiResponse<any>, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  showSuccessToast = false,
  showErrorToast = true,
  invalidateQueries = [],
  setQueryData,
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (showSuccessToast) {
        let message: string;
        if (showSuccessToast === "response") {
          message = data.message || "Operation successful!";
        } else if (typeof showSuccessToast === "string") {
          message = showSuccessToast;
        } else {
          message = "Operation successful!";
        }
        toast.success(message);
      }

      if (setQueryData) {
        const extractedData = setQueryData.dataExtractor(data);
        queryClient.setQueryData(setQueryData.key, extractedData);
      }

      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }

      onSuccess?.(data, variables);
    },

    onError: (error: ApiError, variables) => {
      // Don't show toast for 401/403 errors (handled by API interceptor)
      if (
        showErrorToast &&
        error.response?.status !== 401 &&
        error.response?.status !== 403
      ) {
        let message: string;
        if (showErrorToast === "response") {
          message =
            error.response?.data?.message ||
            error.message ||
            "An error occurred";
        } else if (typeof showErrorToast === "string") {
          message = showErrorToast;
        } else {
          message =
            error.response?.data?.message ||
            error.message ||
            "An error occurred";
        }
        toast.error(message);
      }

      onError?.(error, variables);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}
