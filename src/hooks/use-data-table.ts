import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import type { PageInfo } from "@/types/base";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

type Fetcher<TResponse> = (params: {
  page: number;
  q: string;
  limit: number;
  corporate_id: string | null;
}) => Promise<TResponse>;

const POLLING_INTERVAL = 3000;
const MAX_POLLING_ATTEMPTS = 8;

export const useDataTable = <TResponse, TData>(
  fetcher: Fetcher<TResponse>,
  queryKey: string | unknown[],
  initialPage: number,
  initialLimit: number = 10,
  dataExtractor: (response: TResponse) => TData[],
  pageInfoExtractor: (response: TResponse) => PageInfo | null,
) => {
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(initialLimit);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { selectedCorporate } = useAuthStore();

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
      { page, q: debouncedSearchTerm, limit, corporate_id: selectedCorporate },
    ],
    queryFn: () => {
      return fetcher({
        page,
        q: debouncedSearchTerm,
        limit,
        corporate_id: selectedCorporate,
      });
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });

  const data = (response && dataExtractor(response)) || [];
  const pageInfo = (response && pageInfoExtractor(response)) || null;

  const isProcessing = useMemo(() => {
    return data.some((item: any) =>
      item.image_url?.endsWith("/processing.png"),
    );
  }, [data]);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    if (isProcessing) {
      if (pollingAttempts < MAX_POLLING_ATTEMPTS) {
        const timer = setTimeout(() => {
          setPollingAttempts((prev) => prev + 1);
          refetch();
        }, POLLING_INTERVAL);

        return () => clearTimeout(timer);
      } else {
        toast.error("Image polling time limit reached. Stop.");
        setPollingAttempts(0);
      }
    } else {
      if (pollingAttempts > 0) {
        setPollingAttempts(0);
      }
    }
  }, [isProcessing, isFetching, pollingAttempts, refetch]);

  return {
    data,
    pageInfo,
    loading: isLoading,
    isFetching,
    isError,
    page,
    setPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
  };
};
