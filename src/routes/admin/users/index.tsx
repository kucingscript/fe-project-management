import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { userColumns } from "@/components/data-table/columns";
import type { UserListResponse } from "@/types/user";
import { getListUsers } from "@/services/userService";
import { DataTableFilterSelect } from "@/components/data-table/filter/dt-filter-select";
import { USER_STATUS_OPTIONS_ALL } from "@/constants";

export const Route = createFileRoute("/admin/users/")({
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

  const [status, setStatus] = useState<string>("ALL");

  const userFetcher = (params: {
    page: number;
    q: string;
    limit: number;
    corporate_id: string | null;
  }) => {
    return getListUsers({
      ...params,
      corporate_id: params.corporate_id ?? undefined,
      status:
        status === "ALL"
          ? undefined
          : (status as "ACTIVE" | "INACTIVE" | "SUSPENDED"),
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
    userFetcher,
    ["user-lists", status],
    initialPage,
    initialLimit,
    (response: UserListResponse) => response.data,
    (response: UserListResponse) => response.pageInfo ?? null,
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
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex gap-2 items-center flex-wrap justify-start">
          <DataTableFilterSelect
            value={status}
            onValueChange={setStatus}
            options={USER_STATUS_OPTIONS_ALL}
            placeholder="Select status"
            className="w-40"
          />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={userColumns}
        data={data}
        loading={loading}
        isFetching={isFetching}
        isError={isError}
        pageInfo={pageInfo}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </div>
  );
}
