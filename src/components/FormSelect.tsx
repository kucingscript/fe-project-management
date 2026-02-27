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
import type React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface FormSelectProps<T extends Record<string, any>> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: SelectOption[];
  className?: string;
  icon?: React.ReactNode;
}

const FormSelect = <T extends Record<string, any>>(
  props: FormSelectProps<T>,
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const fieldError = errors[props.name] as FieldError | undefined;

  const {
    name,
    label,
    placeholder,
    disabled,
    required,
    options,
    className,
    icon,
  } = props;

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
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger
                id={name}
                className={cn("w-full", icon ? "pl-10" : "")}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.length > 0 ? (
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

export default FormSelect;
