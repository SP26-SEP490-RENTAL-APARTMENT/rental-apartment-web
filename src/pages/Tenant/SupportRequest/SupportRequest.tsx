import { supportTicketApi } from "@/services/privateApi/tenantApi";
import type { SupportTicket } from "@/types/supportTicket";
import { useCallback, useEffect, useState } from "react";
import {
  SupportTicketFilters,
  type FilterState,
} from "./components/SupportTicketFilters";
import { SupportTicketCard } from "./components/SupportTicketCard";
import { SupportTicketSkeleton } from "./components/SupportTicketSkeleton";
import { CreateTicketDialog } from "./components/CreateTicketDialog";
import { TicketDetailDialog } from "./components/TicketDetailDialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function SupportRequest() {
  const { t } = useTranslation("support");
  const { t: commonT } = useTranslation("common");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketDetail, setTicketDetail] = useState<SupportTicket | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  });

  const pageSize = 9;
  const totalPages = Math.ceil(total / pageSize);

  const fetchMyTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      // Add filters to params if they are not "all"
      if (filters.status !== "all") {
        params.status = filters.status;
      }
      if (filters.priority !== "all") {
        params.priority = filters.priority;
      }
      if (filters.category !== "all") {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }

      const response = await supportTicketApi.getMyTickets(params);
      setTickets(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    setPage(1); // Reset to page 1 when filters change
  }, [filters]);

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setDetailDialogOpen(true);
    setTicketDetail(ticket);
  };

  const handleCreateTicket = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateTicketSuccess = () => {
    setPage(1);
    fetchMyTickets();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t("support.title")}</h1>
              <p className="text-blue-100 text-sm mt-2">
                {t("support.description")}
              </p>
            </div>
            <Button
              onClick={handleCreateTicket}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              {commonT("button.newTicket")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <SupportTicketFilters
            onFilterChange={handleFilterChange}
            isLoading={loading}
          />

          {/* Empty State */}
          {!loading && tickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t("noTickets")}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {t("noTicketsDescription")}
              </p>
              <Button onClick={handleCreateTicket}>
                <Plus className="h-4 w-4 mr-2" />
                {t("createFirstTicket")}
              </Button>
            </div>
          )}

          {/* Tickets Grid */}
          {(loading || tickets.length > 0) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <SupportTicketSkeleton count={pageSize} />
                ) : (
                  tickets.map((ticket) => (
                    <SupportTicketCard
                      key={ticket.ticketId}
                      ticket={ticket}
                      onView={handleViewTicket}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show max 5 page numbers
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNum);
                            }}
                            isActive={page === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateTicketSuccess}
      />

      {/* Ticket Detail Dialog */}
      <TicketDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        ticket={ticketDetail}
      />
    </div>
  );
}

export default SupportRequest;
