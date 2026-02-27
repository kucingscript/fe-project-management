import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  corporateFormSchema,
  type CorporateCreateSchema,
} from "@/validators/corporate";
import { createCorporate } from "@/services/corporateService";
import FormInput from "@/components/FormInput";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import {
  BoomBox,
  Briefcase,
  Mail,
  NotebookPen,
  Phone,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { handleApiError } from "@/lib/apiError";
import type { CorporatePayload } from "@/types/corporate";
import FormSelect from "@/components/FormSelect";
import { INDUSTRY_OPTIONS } from "@/constants";

interface CreateCorporateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CreateCorporateModal = ({
  isOpen,
  onOpenChange,
}: CreateCorporateModalProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const methods = useForm<CorporateCreateSchema>({
    resolver: zodResolver(corporateFormSchema),
  });

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const mutation = useMutation({
    mutationFn: createCorporate,
    onSuccess: () => {
      toast.success("Corporate created successfully!");
      queryClient.invalidateQueries({ queryKey: ["corporate-lists"] });
      queryClient.invalidateQueries({
        queryKey: ["corporates-for-user", user?.user_id],
      });
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to create corporate.");
    },
  });

  const onSubmit = (data: CorporateCreateSchema) => {
    const payload: CorporatePayload = {
      ...data,
      industry_type: data.industry_type || "SOFTWARE",
    };

    mutation.mutate(payload);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      clearErrors("root");
    }
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title="Create New Corporate"
      description="Fill in the details below to add a new corporate."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Create Corporate"
      contentClassName="sm:max-w-2xl"
    >
      <FormErrorAlert />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="code"
          label="Code"
          type="text"
          placeholder="Enter unique corporate code"
          icon={<BoomBox className="h-4 w-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />

        <FormInput
          name="name"
          label="Name"
          type="text"
          placeholder="Enter corporate name"
          icon={<NotebookPen className="h-4 w-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />

        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter corporate email"
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />

        <FormInput
          name="phone"
          label="Phone Number"
          type="text"
          placeholder="Enter phone number"
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />

        <FormSelect
          name="industry_type"
          label="Industry Type"
          placeholder="Select Industry Type"
          options={INDUSTRY_OPTIONS}
          icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
          disabled={isSubmitting}
        />

        <FormInput
          name="company_size"
          label="Company Size"
          type="number"
          placeholder="Number of employees"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="mt-4">
        <FormInput
          name="address"
          label="Address"
          type="textarea"
          placeholder="Enter full corporate address"
          disabled={isSubmitting}
          required
        />
      </div>
    </FormModal>
  );
};

export default CreateCorporateModal;
