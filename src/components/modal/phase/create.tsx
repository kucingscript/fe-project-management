import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { phaseFormSchema, type PhaseCreateSchema } from "@/validators/phase";
import { createPhase } from "@/services/phaseService";
import FormInput from "@/components/FormInput";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import { handleApiError } from "@/lib/apiError";
import { Calendar, ClipboardPen, FileText } from "lucide-react";
import type { PhasePayload } from "@/types/phase";
import { useAuthStore } from "@/stores/auth";
import { PHASE_STATUS_OPTION } from "@/constants";

interface CreatePhaseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
}

const CreatePhaseModal = ({
  isOpen,
  onOpenChange,
  projectId,
}: CreatePhaseModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<PhaseCreateSchema>({
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

  const mutation = useMutation({
    mutationFn: (payload: PhasePayload) => {
      if (!selectedCorporate) {
        throw new Error("Corporate ID is missing");
      }
      return createPhase(selectedCorporate, projectId, payload);
    },
    onSuccess: () => {
      toast.success("Phase created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["sidebar-phases", selectedCorporate, projectId],
      });
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to create phase.");
    },
  });

  const onSubmit = (data: PhaseCreateSchema) => {
    if (!selectedCorporate) {
      toast.error("Please select a corporate first.");
      return;
    }

    const existingPhases = queryClient.getQueryData<any>([
      "sidebar-phases",
      selectedCorporate,
      projectId,
    ]);

    const currentPhaseCount = existingPhases?.data?.length || 0;

    const payload: PhasePayload = {
      name: data.name,
      description: data.description || "",
      status: data.status || "NOT_STARTED",
      start_date: data.start_date ? data.start_date.toISOString() : "",
      end_date: data.end_date ? data.end_date.toISOString() : "",

      order_index: currentPhaseCount,
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
      title="Create New Phase"
      description="Add a new phase to organize your project timeline."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Create Phase"
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

export default CreatePhaseModal;
