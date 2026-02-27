import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_BY_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";

interface OrderByFilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const OrderByFilterSelect = ({
  value,
  onValueChange,
  className,
}: OrderByFilterSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-[130px]", className)}>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_BY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
