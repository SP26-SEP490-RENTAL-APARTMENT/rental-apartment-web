import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import getPages from "./getPages";

export interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}
function PaginationComponent({
  page,
  onPageChange,
  totalPages,
}: PaginationProps) {
  const handlePrev = () => {
    onPageChange(Math.max(page - 1, 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(page + 1, totalPages));
  };

  const pages = getPages(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Pages */}
        {pages.map((p, index) => (
          <PaginationItem key={index}>
            {p === "..." ? (
              <span className="px-2 text-gray-500">...</span>
            ) : (
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
