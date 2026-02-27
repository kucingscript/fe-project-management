import type { SelectOption } from "@/components/FormSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTableFilterSelectProps<TValue extends string> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function DataTableFilterSelect<TValue extends string>({
  value,
  onValueChange,
  options,
  placeholder = "Select filter",
  className,
}: DataTableFilterSelectProps<TValue>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
