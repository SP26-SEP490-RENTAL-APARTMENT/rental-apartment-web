import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

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
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
