import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  projectFormSchema,
  type ProjectUpdateSchema,
} from "@/validators/project";
import { updateProject } from "@/services/projectService";
import FormInput from "@/components/FormInput";
import FormModal from "@/components/modal/form-modal";
import FormErrorAlert from "@/components/FormErrorAlert";
import FormSelect from "@/components/FormSelect";
import { handleApiError } from "@/lib/apiError";
import { useAuthStore } from "@/stores/auth";
import {
  Briefcase,
  Calendar,
  ClipboardPen,
  FileText,
  FolderOpen,
} from "lucide-react";
import { PROJECT_STATUS_OPTION, PROJECT_TYPE_OPTION } from "@/constants";
import type { Project, ProjectPayload } from "@/types/project";

interface EditProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectToEdit: Project | null;
}

const EditProjectModal = ({
  isOpen,
  onOpenChange,
  projectToEdit,
}: EditProjectModalProps) => {
  const queryClient = useQueryClient();
  const { selectedCorporate } = useAuthStore();

  const methods = useForm<ProjectUpdateSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      project_type: "SOFTWARE",
      status: "ACTIVE",
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
    if (projectToEdit && isOpen) {
      reset({
        name: projectToEdit.name,
        description: projectToEdit.description,
        project_type: projectToEdit.project_type,
        status: projectToEdit.status,
        start_date: projectToEdit.start_date
          ? new Date(projectToEdit.start_date)
          : undefined,
        end_date: projectToEdit.end_date
          ? new Date(projectToEdit.end_date)
          : undefined,
      });
    }
  }, [projectToEdit, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (payload: ProjectPayload) => {
      if (!selectedCorporate || !projectToEdit) {
        throw new Error("Missing corporate ID or project ID");
      }
      return updateProject(
        selectedCorporate,
        projectToEdit.project_id,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["project-lists"] });
      queryClient.invalidateQueries({
        queryKey: ["sidebar-projects", selectedCorporate],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectToEdit?.project_id],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      handleApiError(error, setError, "Failed to update project.");
    },
  });

  const onSubmit = (data: ProjectUpdateSchema) => {
    if (!selectedCorporate) return;

    const payload: ProjectPayload = {
      name: data.name,
      description: data.description,
      project_type: data.project_type || "SOFTWARE",
      status: data.status || "ACTIVE",
      start_date: data.start_date ? data.start_date.toISOString() : "",
      end_date: data.end_date ? data.end_date.toISOString() : "",
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
      title="Edit Project"
      description="Update the details of your selected project."
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitText="Save Changes"
      contentClassName="sm:max-w-2xl"
    >
      <FormErrorAlert />

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <FolderOpen className="w-4 h-4" />
            <h3>Project Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              name="name"
              label="Project Name"
              type="text"
              placeholder="Enter project name"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              disabled={isSubmitting}
              required
            />
            <FormInput
              name="description"
              label="Description"
              type="textarea"
              placeholder="Enter comprehensive project description"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <Briefcase className="w-4 h-4" />
            <h3>Classification & Status</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              name="project_type"
              label="Project Type"
              placeholder="Select project type"
              options={PROJECT_TYPE_OPTION}
              icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
              disabled={isSubmitting}
            />
            <FormSelect
              name="status"
              label="Project Status"
              placeholder="Select status"
              options={PROJECT_STATUS_OPTION}
              icon={<ClipboardPen className="w-4 h-4 text-muted-foreground" />}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold border-b pb-2">
            <Calendar className="w-4 h-4" />
            <h3>Timeline</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="start_date"
              label="Start Date"
              type="date"
              disabled={isSubmitting}
            />
            <FormInput
              name="end_date"
              label="End Date"
              type="date"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default EditProjectModal;
