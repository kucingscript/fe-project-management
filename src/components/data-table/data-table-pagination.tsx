import { memo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  isFetching?: boolean;
}

const DataTablePagination = ({
  page,
  totalPage,
  setPage,
  isFetching = false,
}: DataTablePaginationProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(1)}
        disabled={page === 1 || isFetching}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page - 1)}
        disabled={page === 1 || isFetching}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPage || isFetching}
        aria-label="Go to next page"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(totalPage)}
        disabled={page === totalPage || isFetching}
        aria-label="Go to last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(DataTablePagination);
