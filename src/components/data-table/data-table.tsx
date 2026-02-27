import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTablePagination from "./data-table-pagination";
import { TableSkeleton } from "./data-table-skeleton";
import type { PageInfo } from "@/types/base";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  isFetching: boolean;
  isError: boolean;
  pageInfo: PageInfo | null;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  getRowCanExpand?: (row: Row<TData>) => boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  isFetching,
  isError,
  pageInfo,
  page,
  setPage,
  limit,
  renderSubComponent,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: getRowCanExpand ?? (() => !!renderSubComponent),
    manualPagination: true,
    rowCount: pageInfo?.total ?? 0,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  if (loading && data.length === 0) {
    return <TableSkeleton columns={columns} rowCount={limit} />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  Failed to fetch data. Server might be down.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsExpanded() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="p-0 border-b"
                      >
                        <div className="p-4 overflow-hidden animate-in slide-in-from-top-2">
                          {renderSubComponent({ row })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data.length} of {pageInfo?.total ?? 0} data.
        </div>
        {pageInfo && pageInfo.totalPage > 1 && (
          <DataTablePagination
            page={page}
            totalPage={pageInfo.totalPage}
            setPage={setPage}
            isFetching={isFetching}
          />
        )}
      </div>
    </div>
  );
}
