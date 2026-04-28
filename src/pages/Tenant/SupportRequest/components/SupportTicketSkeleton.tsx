import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportTicketSkeletonProps {
  count?: number;
}

export function SupportTicketSkeleton({
  count = 3,
}: SupportTicketSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={`skeleton-${idx}`} className="animate-pulse">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>

            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
