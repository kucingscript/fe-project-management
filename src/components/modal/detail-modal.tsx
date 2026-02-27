import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Loader from "../Loader";
import type React from "react";
import { cn } from "@/lib/utils";

interface DetailModalProps<T> {
  data: T | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isLoading: boolean;
  isError: boolean;
  title: string;
  description?: string;
  children: (data: T) => React.ReactNode;
  contentClassName?: string;
}

const DetailModal = <T,>({
  data,
  isOpen,
  onOpenChange,
  isLoading,
  isError,
  title,
  description,
  children,
  contentClassName,
}: DetailModalProps<T>) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("flex flex-col max-h-[85vh]", contentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar pr-3">
          {isLoading && (
            <div className="flex justify-center items-center h-24">
              <Loader />
            </div>
          )}
          {isError && !isLoading && (
            <div className="text-red-500 text-center h-24 flex items-center justify-center">
              Failed to load details.
            </div>
          )}
          {!isLoading && !isError && data && (
            <div className="space-y-4 pt-4">{children(data)}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
