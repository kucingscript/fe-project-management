import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS_ALL } from "@/constants";
import { cn } from "@/lib/utils";

interface StatusFilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const StatusFilterSelect = ({
  value,
  onValueChange,
  className,
}: StatusFilterSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-[160px]", className)}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS_ALL.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
