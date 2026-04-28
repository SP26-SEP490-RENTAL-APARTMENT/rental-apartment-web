export interface SupportTicket {
  ticketId: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolveBy: string | null;
  resolutionNotes: string | null;
}
