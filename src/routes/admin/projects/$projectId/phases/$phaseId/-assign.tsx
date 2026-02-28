import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignUsersToTaskGroup } from "@/services/taskGroupService";
import { getListUsers } from "@/services/userService";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import FormSelectAsync from "@/components/FormSelectAsync";
import { handleApiError } from "@/lib/apiError";
import { useAuthStore } from "@/stores/auth";
import { Shield, Trash, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskGroup, TaskGroupAssignmentPayload } from "@/types/task-group";
import { assignmentSchema, type AssignSchema } from "@/validators/task-group";
import { TASK_GROUP_OPTION } from "@/constants";

interface AssignTaskGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  taskGroup: TaskGroup | null;
}

const AssignTaskGroupModal = ({
  isOpen,
  onOpenChange,
  projectId,
  taskGroup,
}: AssignTaskGroupModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<AssignSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      access_type: "VIEWER",
      user_ids: [{ user_id: "" }],
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "user_ids",
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        access_type: "VIEWER",
        user_ids: [{ user_id: "" }],
      });
      clearErrors("root");
    }
  }, [isOpen, reset, clearErrors]);

  const mutation = useMutation({
    mutationFn: (payload: TaskGroupAssignmentPayload) => {
      if (!selectedCorporate || !taskGroup) {
        throw new Error("Missing corporate ID or task group ID");
      }
      return assignUsersToTaskGroup(
        selectedCorporate,
        projectId,
        taskGroup.task_group_id,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Users assigned successfully!");
      queryClient.invalidateQueries({
        queryKey: [
          "task-groups",
          selectedCorporate,
          projectId,
          taskGroup?.phase_id,
        ],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to assign users.");
    },
  });

  const onSubmit = (data: AssignSchema) => {
    if (!selectedCorporate || !taskGroup) return;

    const payload: TaskGroupAssignmentPayload = {
      access_type: data.access_type,
      user_ids: data.user_ids.filter((u) => u.user_id !== ""),
    };

    if (payload.user_ids.length === 0) {
      setError("root", {
        type: "manual",
        message: "Please select at least one user to assign.",
      });
      return;
    }

    mutation.mutate(payload);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Assign Users"
      description={`Assign users to ${taskGroup?.name || "this task group"}.`}
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Assign"
      contentClassName="sm:max-w-xl"
    >
      <FormErrorAlert />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <Shield className="w-4 h-4" />
            <h3>Access Level</h3>
          </div>

          <FormSelect
            name="access_type"
            label="Access Type"
            placeholder="Select access type"
            options={TASK_GROUP_OPTION}
            icon={<Shield className="w-4 h-4 text-muted-foreground" />}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <Users className="w-4 h-4" />
            <h3>Users</h3>
          </div>

          <div className="space-y-4">
            {errors.user_ids?.root && (
              <p className="text-sm text-destructive">
                {errors.user_ids.root.message}
              </p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <FormSelectAsync
                    name={`user_ids.${index}.user_id`}
                    placeholder="Select user"
                    disabled={isSubmitting}
                    required
                    queryKey={["users", "options", selectedCorporate]}
                    icon={<Users className="w-4 h-4 text-muted-foreground" />}
                    queryFn={() =>
                      getListUsers({
                        corporate_id: selectedCorporate ?? undefined,
                        status: "ACTIVE",
                        limit: 1000,
                      })
                    }
                    optionsTransformer={(response) =>
                      (response?.data || []).map((user) => ({
                        value: user.user_id,
                        label: `${user.user_name} (${user.user_email})`,
                      }))
                    }
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="shrink-0"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ user_id: "" })}
              disabled={isSubmitting}
              className="w-full mt-2 border-dashed"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Add Another User
            </Button>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AssignTaskGroupModal;
