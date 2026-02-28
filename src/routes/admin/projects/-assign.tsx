import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  projectAssignmentSchema,
  type ProjectAssignmentSchema,
} from "@/validators/project";
import { assignUsersToProject } from "@/services/projectService";
import { getListUsers } from "@/services/userService";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import FormSelectAsync from "@/components/FormSelectAsync";
import { handleApiError } from "@/lib/apiError";
import { useAuthStore } from "@/stores/auth";
import { Shield, Trash, UserPlus, Users } from "lucide-react";
import type { Project, ProjectAssignmentPayload } from "@/types/project";
import { Button } from "@/components/ui/button";

interface AssignProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectData: Project | null;
}

const AssignProjectModal = ({
  isOpen,
  onOpenChange,
  projectData,
}: AssignProjectModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<ProjectAssignmentSchema>({
    resolver: zodResolver(projectAssignmentSchema),
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
    formState: { isSubmitting },
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
    mutationFn: (payload: ProjectAssignmentPayload) => {
      if (!selectedCorporate || !projectData) {
        throw new Error("Missing corporate ID or project ID");
      }
      return assignUsersToProject(
        selectedCorporate,
        projectData.project_id,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Users assigned to project successfully!");
      queryClient.invalidateQueries({ queryKey: ["project-lists"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectData?.project_id],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to assign users.");
    },
  });

  const onSubmit = (data: ProjectAssignmentSchema) => {
    if (!selectedCorporate || !projectData) return;

    const payload: ProjectAssignmentPayload = {
      access_type: data.access_type || "VIEWER",
      user_ids: data.user_ids,
    };

    mutation.mutate(payload);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Assign Users"
      description={`Assign users to ${projectData?.name || "this project"}.`}
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Assign"
      contentClassName="sm:max-w-xl"
    >
      <FormErrorAlert />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b">
            <Shield className="w-4 h-4" />
            <h3>Access Level</h3>
          </div>

          <FormSelect
            name="access_type"
            label="Access Type"
            placeholder="Select access type"
            options={[
              { label: "Editor", value: "EDITOR" },
              { label: "Viewer", value: "VIEWER" },
            ]}
            icon={<Shield className="w-4 h-4 text-muted-foreground" />}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b">
            <Users className="w-4 h-4" />
            <h3>Users</h3>
          </div>

          <div className="space-y-4">
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
                    // optionsTransformer={(response) =>
                    //   (response?.data || [])
                    //     .filter(
                    //       (user) =>
                    //         user.role_code !== "ADMIN" &&
                    //         user.role_code !== "OWNER"
                    //     )
                    //     .map((user) => ({
                    //       value: user.user_id,
                    //       label: `${user.user_name} (${user.user_email})`,
                    //     }))
                    // }
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

export default AssignProjectModal;
