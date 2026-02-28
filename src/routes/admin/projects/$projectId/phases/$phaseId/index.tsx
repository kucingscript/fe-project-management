import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { getListTaskGroup } from "@/services/taskGroupService";
import { ChevronRight, Pen, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateTaskGroupModal from "@/components/modal/task-group/create";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Loader from "@/components/Loader";
import { COLOR_PALETTE } from "@/constants";
import type { TaskGroup } from "@/types/task-group";
import AssignTaskGroupModal from "./-assign";
import UpdateTaskGroupModal from "./-update";

export const Route = createFileRoute(
  "/admin/projects/$projectId/phases/$phaseId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId, phaseId } = Route.useParams();
  const { selectedCorporate } = useAuthStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | null>(null);

  const handleAssignClick = (group: TaskGroup) => {
    setSelectedGroup(group);
    setIsAssignModalOpen(true);
  };

  const handleUpdateClick = (group: TaskGroup) => {
    setSelectedGroup(group);
    setIsUpdateModalOpen(true);
  };

  const { data: taskGroupsResponse, isLoading } = useQuery({
    queryKey: ["task-groups", selectedCorporate, projectId, phaseId],
    queryFn: () =>
      getListTaskGroup(selectedCorporate!, projectId, {
        phase_id: phaseId,
        limit: 100,
      }),
    enabled: !!selectedCorporate && !!projectId && !!phaseId,
  });

  const taskGroups = taskGroupsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Groups</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Organize and manage tasks within this phase.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-sm hover:shadow transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task Group
        </Button>
      </div>

      <div className="space-y-4">
        {taskGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No Task Groups</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm mt-1">
              Get started by creating a new task group to organize your tasks in
              this phase.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="outline"
              className="shadow-sm"
            >
              Create Task Group
            </Button>
          </div>
        ) : (
          taskGroups.map((group, index) => {
            const colorClass = COLOR_PALETTE[index % COLOR_PALETTE.length];

            return (
              <Collapsible
                key={group.task_group_id}
                defaultOpen
                className="group/collapsible border rounded-xl bg-card shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                <div className="flex items-center group/header p-3 transition-colors hover:bg-muted/40">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 w-8 mr-3 text-muted-foreground hover:text-foreground shrink-0 rounded-full hover:bg-muted"
                    >
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${colorClass}`}
                      aria-hidden="true"
                    />
                    <div className="font-semibold text-base tracking-tight truncate">
                      {group.name}
                    </div>

                    <div className="text-xs text-muted-foreground font-medium bg-muted/80 px-2.5 py-0.5 rounded-full shrink-0">
                      0 Tasks
                    </div>
                  </div>

                  <div className="opacity-0 group-hover/header:opacity-100 transition-opacity flex items-center gap-1 ml-auto pl-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="Assign Users"
                      onClick={() => handleAssignClick(group)}
                    >
                      <Users className="h-3.5 w-3.5 sm:mr-1.5" />
                      <span className="text-xs hidden sm:inline-block font-medium">
                        Assign
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      title="Edit Group"
                      onClick={() => handleUpdateClick(group)}
                    >
                      <Pen className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 ml-1 shadow-sm"
                      title="Add Task"
                    >
                      <Plus className="h-3.5 w-3.5 sm:mr-1.5" />
                      <span className="text-xs hidden sm:inline-block">
                        Add Task
                      </span>
                    </Button>
                  </div>
                </div>

                <CollapsibleContent className="px-4 sm:px-14 pb-5 pt-2">
                  {group.description && (
                    <div className="text-sm text-muted-foreground mb-4 max-w-3xl leading-relaxed">
                      {group.description}
                    </div>
                  )}
                  <div className="rounded-lg border border-dashed p-8 text-center bg-muted/10 flex flex-col items-center justify-center transition-colors hover:bg-muted/20">
                    <p className="text-sm text-foreground font-medium mb-1">
                      No tasks yet
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Add a task to get started
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 bg-background shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add Task
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </div>

      <CreateTaskGroupModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId={projectId}
        defaultPhaseId={phaseId}
      />

      <AssignTaskGroupModal
        isOpen={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        projectId={projectId}
        taskGroup={selectedGroup}
      />

      <UpdateTaskGroupModal
        isOpen={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        projectId={projectId}
        taskGroup={selectedGroup}
      />
    </div>
  );
}
