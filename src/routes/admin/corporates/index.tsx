import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { corporateColumns } from "@/components/data-table/columns";
import type { CorporateListResponse } from "@/types/corporate";
import { getListCorporates } from "@/services/corporateService";
import CreateCorporateModal from "./-create";
import { StatusFilterSelect } from "@/components/data-table/filter/dt-status-filter";

export const Route = createFileRoute("/admin/corporates/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
    limit: Number(search.limit ?? 10),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { page: initialPage, limit: initialLimit } = useSearch({
    from: Route.id,
  });

  // const canCreate = hasPermission(PERMISSIONS.CORPORATE.CREATE);
  const canCreate = true;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const corporateFetcher = (params: {
    page: number;
    q: string;
    limit: number;
    corporate_id: string | null;
  }) => {
    return getListCorporates({
      page: params.page,
      limit: params.limit,
      q: params.q,
      status: status === "ALL" ? undefined : status,
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
    corporateFetcher,
    ["corporate-lists", status],
    initialPage,
    initialLimit,
    (response: CorporateListResponse) => response.data,
    (response: CorporateListResponse) => response.pageInfo ?? null,
  );

  useEffect(() => {
    navigate({
      search: { page, limit },
      replace: true,
    });
  }, [page, limit, navigate]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Corporates</h1>
        <div className="flex gap-2 items-center flex-wrap justify-start">
          <StatusFilterSelect
            value={status}
            onValueChange={(value) =>
              setStatus(value as "ALL" | "ACTIVE" | "INACTIVE")
            }
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name/code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
          {canCreate && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />{" "}
              <span className="-mt-1">New Corporate</span>
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={corporateColumns}
        data={data}
        loading={loading}
        isFetching={isFetching}
        isError={isError}
        pageInfo={pageInfo}
        page={page}
        setPage={setPage}
        limit={limit}
      />

      <CreateCorporateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
