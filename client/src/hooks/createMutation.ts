import { useNavigate } from "react-router-dom";
import { useApiMutation } from "./useApiMutation";

interface MutationPreset {
  showToasts?: boolean;
  cacheKey?: string[];
  dataExtractor?: (data: any) => any;
  invalidateQueries?: string[];
  redirectTo?: string;
}

export function createMutation<TVariables, TResponse>(
  mutationFn: (variables: TVariables) => Promise<TResponse>,
  preset: MutationPreset = {}
) {
  return (customHandlers?: {
    onSuccess?: (response: TResponse) => void;
    onError?: (error: any) => void;
  }) => {
    const navigate = useNavigate();

    return useApiMutation({
      mutationFn,
      showSuccessToast: preset.showToasts ? "response" : false,
      showErrorToast: preset.showToasts !== false ? "response" : false,
      ...(preset.cacheKey &&
        preset.dataExtractor && {
          setQueryData: {
            key: preset.cacheKey,
            dataExtractor: preset.dataExtractor,
          },
        }),
      invalidateQueries: preset.invalidateQueries || [],
      onSuccess: (response) => {
        if (preset.redirectTo) {
          navigate(preset.redirectTo);
        }
        customHandlers?.onSuccess?.(response);
      },
      onError: (error) => {
        customHandlers?.onError?.(error);
      },
    });
  };
}
