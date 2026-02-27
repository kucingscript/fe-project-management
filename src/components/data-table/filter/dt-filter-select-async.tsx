import type { SelectOption } from "@/components/FormSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useMemo } from "react";

interface DataTableFilterSelectAsyncProps<TValue extends string, TQueryData> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  placeholder?: string;
  className?: string;
  queryKey: QueryKey;
  queryFn: () => Promise<TQueryData>;
  optionsTransformer: (data: TQueryData) => SelectOption[];
  loadingPlaceholder?: string;
  firstOption?: SelectOption;
}

export function DataTableFilterSelectAsync<TValue extends string, TQueryData>({
  value,
  onValueChange,
  placeholder = "Select filter",
  className,
  queryKey,
  queryFn,
  optionsTransformer,
  loadingPlaceholder = "Loading data...",
  firstOption,
}: DataTableFilterSelectAsyncProps<TValue, TQueryData>) {
  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const options: SelectOption[] = useMemo(() => {
    if (!queryData) return [];
    return optionsTransformer(queryData);
  }, [queryData, optionsTransformer]);

  const isDisabled = isLoading || isError;
  let currentPlaceholder = placeholder;
  if (isLoading) currentPlaceholder = loadingPlaceholder;
  if (isError) currentPlaceholder = "Error loading data";

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isDisabled}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={currentPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {firstOption && (
          <SelectItem value={firstOption.value}>{firstOption.label}</SelectItem>
        )}
        {isLoading ? (
          <SelectItem value="loading" disabled>
            {loadingPlaceholder}
          </SelectItem>
        ) : isError ? (
          <SelectItem value="error" disabled>
            Error loading data
          </SelectItem>
        ) : options.length > 0 ? (
          options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-options" disabled>
            No options available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
