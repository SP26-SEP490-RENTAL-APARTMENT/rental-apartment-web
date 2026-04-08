import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingHistorySkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
        {/* LEFT */}
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-40" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-2 min-w-[150px]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}