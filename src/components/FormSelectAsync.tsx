import {
  useFormContext,
  type FieldError,
  type Path,
  Controller,
} from "react-hook-form";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import type { SelectOption } from "./FormSelect";
import { cn } from "@/lib/utils";

interface FormSelectAsyncProps<TForm extends Record<string, any>, TQueryData> {
  name: Path<TForm>;
  label?: ReactNode | undefined;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  queryKey: QueryKey;
  queryFn: () => Promise<TQueryData>;
  optionsTransformer: (data: TQueryData) => SelectOption[];
  loadingPlaceholder?: string;
  icon?: ReactNode;
}

const FormSelectAsync = <TForm extends Record<string, any>, TQueryData>(
  props: FormSelectAsyncProps<TForm, TQueryData>,
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TForm>();
  const fieldError = errors[props.name] as FieldError | undefined;

  const {
    name,
    label,
    placeholder = "Select an option",
    disabled = false,
    required,
    className,
    queryKey,
    queryFn,
    optionsTransformer,
    loadingPlaceholder = "Loading data...",
    icon,
  } = props;

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

  const isDisabled = disabled || isLoading || isError;
  let currentPlaceholder = placeholder;
  if (isLoading) currentPlaceholder = loadingPlaceholder;
  if (isError) currentPlaceholder = "Error loading data";

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn("relative", label ? "mt-2 ml-1" : "")}>
            {icon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground z-10">
                {icon}
              </div>
            )}
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
              disabled={isDisabled}
            >
              <SelectTrigger
                id={name}
                className={cn("w-full", icon ? "pl-10" : "")}
              >
                <SelectValue placeholder={currentPlaceholder} />
              </SelectTrigger>
              <SelectContent>
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
          </div>
        )}
      />

      {fieldError && (
        <p className="text-xs mt-2 text-red-500">{fieldError.message}</p>
      )}
    </div>
  );
};

export default FormSelectAsync;
