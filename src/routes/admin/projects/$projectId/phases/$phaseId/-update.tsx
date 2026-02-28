import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { updateTaskGroup } from "@/services/taskGroupService";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormInput from "@/components/FormInput";
import { handleApiError } from "@/lib/apiError";
import { useAuthStore } from "@/stores/auth";
import { taskGroupFormSchema } from "@/validators/task-group";
import type { TaskGroup, TaskGroupPayload } from "@/types/task-group";

export type TaskGroupUpdateSchema = z.infer<typeof taskGroupFormSchema>;

interface UpdateTaskGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  taskGroup: TaskGroup | null;
}

const UpdateTaskGroupModal = ({
  isOpen,
  onOpenChange,
  projectId,
  taskGroup,
}: UpdateTaskGroupModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<TaskGroupUpdateSchema>({
    resolver: zodResolver(taskGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      order_index: 0,
      phase_id: "",
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
    if (isOpen && taskGroup) {
      reset({
        name: taskGroup.name || "",
        description: taskGroup.description || "",
        order_index: taskGroup.order_index ?? 0,
        phase_id: taskGroup.phase_id || "",
      });
      clearErrors("root");
    } else if (!isOpen) {
      reset({
        name: "",
        description: "",
        order_index: 0,
        phase_id: "",
      });
      clearErrors("root");
    }
  }, [isOpen, taskGroup, reset, clearErrors]);

  const mutation = useMutation({
    mutationFn: (payload: TaskGroupUpdateSchema) => {
      if (!selectedCorporate || !taskGroup) {
        throw new Error("Missing required IDs");
      }

      const formattedPayload: TaskGroupPayload = {
        name: payload.name,
        description: payload.description || "",
        order_index: payload.order_index ?? taskGroup.order_index,
        phase_id: payload.phase_id || taskGroup.phase_id || "",
      };

      return updateTaskGroup(
        selectedCorporate,
        projectId,
        taskGroup.task_group_id,
        formattedPayload,
      );
    },
    onSuccess: () => {
      toast.success("Task group updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["task-groups", selectedCorporate, projectId],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to update task group.");
    },
  });

  const onSubmit = (data: TaskGroupUpdateSchema) => {
    mutation.mutate(data);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Update Task Group"
      description="Modify the details of the selected task group."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Save Changes"
    >
      <FormErrorAlert />

      <div className="space-y-4">
        <FormInput
          type="text"
          name="name"
          label="Group Name"
          placeholder="Enter task group name"
          disabled={isSubmitting}
          required
        />
        <FormInput
          type="textarea"
          name="description"
          label="Description"
          placeholder="Enter task group description (optional)"
          disabled={isSubmitting}
        />
      </div>
    </FormModal>
  );
};

export default UpdateTaskGroupModal;
