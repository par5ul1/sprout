import { ChevronLeftIcon, ChevronRightIcon, EllipsisIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageButtons = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, null);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(null, totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {getPageButtons().map((page, index) => (
        <PageButton
          key={`page-${page}-${
            // biome-ignore lint/suspicious/noArrayIndexKey: does not reorder
            index
          }`}
          page={page}
          currentPage={currentPage}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRightIcon className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}

function PageButton({
  page,
  currentPage,
  isLoading,
  onPageChange,
}: {
  page: number | null;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) {
  if (page === null) {
    return (
      <div className="flex items-center justify-center">
        <EllipsisIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Button
      variant={page === currentPage ? "default" : "outline"}
      size="sm"
      onClick={() => onPageChange(page)}
      disabled={isLoading}
    >
      {page}
    </Button>
  );
}
