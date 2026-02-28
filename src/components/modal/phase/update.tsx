import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { phaseFormSchema, type PhaseUpdateSchema } from "@/validators/phase";
import { updatePhase } from "@/services/phaseService";
import FormInput from "@/components/FormInput";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import { handleApiError } from "@/lib/apiError";
import { Calendar, ClipboardPen, FileText } from "lucide-react";
import type { Phase, PhasePayload } from "@/types/phase";
import { useAuthStore } from "@/stores/auth";
import { PHASE_STATUS_OPTION } from "@/constants";

interface EditPhaseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  phaseToEdit: Phase | null;
}

const EditPhaseModal = ({
  isOpen,
  onOpenChange,
  projectId,
  phaseToEdit,
}: EditPhaseModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<PhaseUpdateSchema>({
    resolver: zodResolver(phaseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "NOT_STARTED",
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (phaseToEdit && isOpen) {
      reset({
        name: phaseToEdit.name,
        description: phaseToEdit.description || "",
        status: phaseToEdit.status,
        start_date: phaseToEdit.start_date
          ? new Date(phaseToEdit.start_date)
          : undefined,
        end_date: phaseToEdit.end_date
          ? new Date(phaseToEdit.end_date)
          : undefined,
        order_index: phaseToEdit.order_index || 0,
      });
    }
  }, [phaseToEdit, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (payload: PhasePayload) => {
      if (!selectedCorporate || !phaseToEdit) {
        throw new Error("Corporate ID or Phase ID is missing");
      }
      return updatePhase(
        selectedCorporate,
        projectId,
        phaseToEdit.phase_id,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Phase updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["sidebar-phases", selectedCorporate, projectId],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to update phase.");
    },
  });

  const onSubmit = (data: PhaseUpdateSchema) => {
    if (!selectedCorporate) return;

    const payload: PhasePayload = {
      name: data.name,
      description: data.description || "",
      status: data.status || "NOT_STARTED",
      start_date: data.start_date ? data.start_date.toISOString() : "",
      end_date: data.end_date ? data.end_date.toISOString() : "",
      order_index: data.order_index || phaseToEdit?.order_index || 0,
    };

    mutation.mutate(payload);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      clearErrors("root");
    }
    onOpenChange(open);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title="Edit Phase"
      description="Update the details of your selected phase."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Save Changes"
      contentClassName="sm:max-w-xl"
    >
      <FormErrorAlert />

      <div className="space-y-4">
        <FormInput
          name="name"
          label="Phase Name"
          type="text"
          placeholder="Enter phase name"
          icon={<FileText className="w-4 h-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />

        <FormInput
          name="description"
          label="Description"
          type="textarea"
          placeholder="Enter phase description"
          disabled={isSubmitting}
        />

        <FormSelect
          name="status"
          label="Status"
          placeholder="Select phase status"
          options={PHASE_STATUS_OPTION}
          icon={<ClipboardPen className="w-4 h-4 text-muted-foreground" />}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            name="start_date"
            label="Start Date"
            type="date"
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            disabled={isSubmitting}
          />
          <FormInput
            name="end_date"
            label="End Date"
            type="date"
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default EditPhaseModal;