import { type FieldValues, type UseFormSetError } from "react-hook-form";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { ApiErrorResponse } from "@/types/error";
import { isAxiosError } from "axios";

export const handleApiError = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  defaultError = "An unexpected error occurred.",
) => {
  let errorMessage = defaultError;

  if (isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data) {
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage = data.errors[0];
      } else if (data.message) {
        errorMessage = data.message;
      }
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const capitalizedError = capitalizeFirstLetter(errorMessage);
  setError("root", { type: "server", message: capitalizedError });
};
