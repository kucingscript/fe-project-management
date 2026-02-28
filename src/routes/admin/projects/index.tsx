import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useEffect, useState } from "react";
import { CopyPlus, FileText, PlusCircle, Search } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { projectColumns } from "@/components/data-table/columns";
import type { Project, ProjectListResponse } from "@/types/project";
import { getDetailProject, getListProjects } from "@/services/projectService";
import { DataTableFilterSelect } from "@/components/data-table/filter/dt-filter-select";
import {
  PROJECT_STATUS_OPTIONS_ALL,
  PROJECT_TYPE_OPTIONS_ALL,
} from "@/constants";
import { useAuthStore } from "@/stores/auth";
import { usePageModals } from "@/hooks/use-page-modal";
import { useQuery } from "@tanstack/react-query";
import { DataTableRowActions } from "@/components/data-table/table-row-actions";
import DetailModal from "@/components/modal/detail-modal";
import ProjectDetail from "./-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "../../../components/modal/projects/create";
import EditProjectModal from "./-update";
import AssignProjectModal from "./-assign";

export const Route = createFileRoute("/admin/projects/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
    limit: Number(search.limit ?? 10),
  }),
  component: RouteComponent,
});

type ProjectType = Project["project_type"];
type ProjectStatus = Project["status"];

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { page: initialPage, limit: initialLimit } = useSearch({
    from: Route.id,
  });

  const { selectedCorporate } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [selectedProjectForAssign, setSelectedProjectForAssign] =
    useState<Project | null>(null);

  const [status, setStatus] = useState<"ALL" | ProjectStatus>("ALL");
  const [projectType, setProjectType] = useState<"ALL" | ProjectType>("ALL");

  const {
    isDetailModalOpen,
    selectedId: selectedProjectId,
    handleDetailClick,
    handleDetailModalOpenChange,
    isEditModalOpen,
    selectedDataForEdit: selectedProjectForEdit,
    handleEditClick,
    handleEditModalOpenChange,
  } = usePageModals<Project>();

  const {
    data: selectedProject,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useQuery({
    queryKey: ["projects", selectedProjectId],
    queryFn: () => getDetailProject(selectedCorporate!, selectedProjectId!),
    enabled: !!selectedProjectId && !!selectedCorporate,
  });

  const projectFetcher = (params: {
    page: number;
    q: string;
    limit: number;
    corporate_id: string | null;
  }) => {
    return getListProjects({
      ...params,
      corporate_id: params.corporate_id ?? undefined,
      status: status === "ALL" ? undefined : status,
      project_type: projectType === "ALL" ? undefined : projectType,
    });
  };

  const {
    data,
    pageInfo,
    loading,
    isFetching,
    isError,
    page,
    setPage,
    limit,
    searchTerm,
    setSearchTerm,
  } = useDataTable(
    projectFetcher,
    ["project-lists", status, projectType],
    initialPage,
    initialLimit,
    (response: ProjectListResponse) => response.data,
    (response: ProjectListResponse) => response.pageInfo ?? null,
  );

  useEffect(() => {
    navigate({
      search: { page, limit },
      replace: true,
    });
  }, [page, limit, navigate]);

  const handleAssignClick = (project: Project) => {
    setSelectedProjectForAssign(project);
    setIsAssignModalOpen(true);
  };

  const columnsWithOptions = projectColumns.map((column) => {
    if (column.id === "actions") {
      return {
        ...column,
        cell: ({ row }: { row: any }) => (
          <DataTableRowActions
            row={row}
            onDetailClick={() => handleDetailClick(row.original.project_id)}
            onEditClick={() => handleEditClick(row.original)}
            onAssignClick={() => handleAssignClick(row.original)}
          />
        ),
      };
    }
    return column;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2 items-center flex-wrap justify-start md:justify-end w-full md:w-auto">
          <DataTableFilterSelect
            value={status}
            onValueChange={setStatus}
            options={PROJECT_STATUS_OPTIONS_ALL}
            placeholder="Select status"
            className="w-40"
          />

          <DataTableFilterSelect
            value={projectType}
            onValueChange={setProjectType}
            options={PROJECT_TYPE_OPTIONS_ALL}
            placeholder="Select type"
            className="w-40"
          />

          <div className="relative flex-1 md:flex-initial min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name/code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="shrink-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsCreateModalOpen(true)}>
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                Blank Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Open Template Modal")}
              >
                <CopyPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                From Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        columns={columnsWithOptions}
        data={data}
        loading={loading}
        isFetching={isFetching}
        isError={isError}
        pageInfo={pageInfo}
        page={page}
        setPage={setPage}
        limit={limit}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <DetailModal
        data={selectedProject?.data ?? null}
        isOpen={isDetailModalOpen}
        onOpenChange={handleDetailModalOpenChange}
        isLoading={isProjectLoading}
        isError={isProjectError}
        title="Project Detail"
        description="This is the detail of the selected project."
      >
        {(project) => <ProjectDetail project={project} />}
      </DetailModal>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalOpenChange}
        projectToEdit={selectedProjectForEdit}
      />

      <AssignProjectModal
        isOpen={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        projectData={selectedProjectForAssign}
      />
    </div>
  );
}
