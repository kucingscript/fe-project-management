import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Loader from "../Loader";
import type React from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FormModalProps<T extends Record<string, any>> {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: string;
  methods: UseFormReturn<T>;
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  children: React.ReactNode;
  submitText?: string;
  contentClassName?: string;
}

const FormModal = <T extends Record<string, any>>({
  isOpen,
  onOpenChange,
  title,
  description,
  methods,
  onSubmit,
  isSubmitting,
  children,
  submitText = "Submit",
  contentClassName,
}: FormModalProps<T>) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("flex flex-col max-h-[85vh]", contentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="flex flex-col grow min-h-0">
            <div className="grow min-h-0 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
              {children}
            </div>
            <DialogFooter className="mt-auto pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader /> : submitText}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
