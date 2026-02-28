import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type CreateTaskGroupWithAssignSchema,
  createTaskGroupWithAssignSchema,
} from "@/validators/task-group";
import {
  createTaskGroup,
  assignUsersToTaskGroup,
} from "@/services/taskGroupService";
import { getListUsers } from "@/services/userService";
import FormInput from "@/components/FormInput";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import FormSelectAsync from "@/components/FormSelectAsync";
import { handleApiError } from "@/lib/apiError";
import { useAuthStore } from "@/stores/auth";
import {
  FileText,
  ListTodo,
  Shield,
  Trash,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TASK_GROUP_OPTION } from "@/constants";

interface CreateTaskGroupModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: string;
  defaultPhaseId?: string;
}

const CreateTaskGroupModal = ({
  isOpen,
  onOpenChange,
  projectId,
  defaultPhaseId,
}: CreateTaskGroupModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();
  const [showAssignUsers, setShowAssignUsers] = useState(false);

  const methods = useForm<CreateTaskGroupWithAssignSchema>({
    resolver: zodResolver(createTaskGroupWithAssignSchema),
    defaultValues: {
      name: "",
      description: "",
      order_index: 0,
      phase_id: defaultPhaseId || "",
      access_type: "VIEWER",
      user_ids: [],
    },
  });

  const {
    handleSubmit,
    setError,
    reset,
    clearErrors,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "user_ids",
  });

  useEffect(() => {
    if (isOpen) {
      setShowAssignUsers(false);
      reset({
        name: "",
        description: "",
        order_index: 0,
        phase_id: defaultPhaseId || "",
        access_type: "VIEWER",
        user_ids: [],
      });
      clearErrors("root");
    }
  }, [isOpen, defaultPhaseId, reset, clearErrors]);

  const mutation = useMutation({
    mutationFn: async (payload: CreateTaskGroupWithAssignSchema) => {
      if (!selectedCorporate) {
        throw new Error("Corporate ID is missing");
      }

      const taskGroupPayload = {
        name: payload.name,
        description: payload.description || "",
        order_index: payload.order_index ?? 0,
        phase_id: payload.phase_id || "",
      };

      const taskGroupResponse = await createTaskGroup(
        selectedCorporate,
        projectId,
        taskGroupPayload,
      );

      const taskGroupId = taskGroupResponse.data.task_group_id;
      const validUsers = (payload.user_ids || []).filter(
        (user) => user.user_id && user.user_id.trim() !== "",
      );

      if (showAssignUsers && validUsers.length > 0) {
        const assignmentPayload = {
          access_type: payload.access_type || "VIEWER",
          user_ids: validUsers,
        };

        await assignUsersToTaskGroup(
          selectedCorporate,
          projectId,
          taskGroupId,
          assignmentPayload,
        );
      }

      return taskGroupResponse;
    },
    onSuccess: () => {
      toast.success("Task group created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["task-groups", selectedCorporate, projectId],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to create task group.");
    },
  });

  const onSubmit = (data: CreateTaskGroupWithAssignSchema) => {
    if (!selectedCorporate) {
      toast.error("Please select a corporate first.");
      return;
    }

    const validUserIds = showAssignUsers
      ? (data.user_ids || []).filter(
          (u) => u.user_id && u.user_id.trim() !== "",
        )
      : [];

    const existingTaskGroups = queryClient.getQueryData<any>([
      "task-groups",
      selectedCorporate,
      projectId,
    ]);

    const currentTaskGroupCount = existingTaskGroups?.data?.length || 0;

    const payload: CreateTaskGroupWithAssignSchema = {
      ...data,
      user_ids: validUserIds,
      order_index: currentTaskGroupCount,
    };

    mutation.mutate(payload);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Task Group"
      description="Create a new task group for your phase."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Create Task Group"
      contentClassName="sm:max-w-2xl"
    >
      <FormErrorAlert />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <ListTodo className="w-4 h-4" />
            <h3>Task Group Information</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormInput
              name="name"
              label="Group Name"
              type="text"
              placeholder="Enter task group name"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              disabled={isSubmitting}
              required
            />

            <FormInput
              name="description"
              label="Description"
              type="textarea"
              placeholder="Enter group description"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Users className="w-4 h-4" />
              <h3>Assign Users</h3>
            </div>
            {showAssignUsers && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  setShowAssignUsers(false);
                  setValue("user_ids", []);
                }}
              >
                <X className="w-4 h-4 mr-1" /> Cancel Assignment
              </Button>
            )}
          </div>

          {!showAssignUsers ? (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => {
                setShowAssignUsers(true);
                if (fields.length === 0) {
                  append({ user_id: "" });
                }
              }}
              disabled={isSubmitting}
            >
              <UserPlus className="w-4 h-4 mr-2" /> Assign Members
            </Button>
          ) : (
            <>
              <FormSelect
                name="access_type"
                label="Access Type"
                placeholder="Select access type"
                options={TASK_GROUP_OPTION}
                icon={<Shield className="w-4 h-4 text-muted-foreground" />}
                disabled={isSubmitting}
              />

              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <div className="flex-1">
                      <FormSelectAsync
                        name={`user_ids.${index}.user_id`}
                        placeholder="Select user"
                        disabled={isSubmitting}
                        queryKey={["users", "options", selectedCorporate]}
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
                        icon={
                          <Users className="w-4 h-4 text-muted-foreground" />
                        }
                      />
                    </div>
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
            </>
          )}
        </div>
      </div>
    </FormModal>
  );
};

export default CreateTaskGroupModal;
