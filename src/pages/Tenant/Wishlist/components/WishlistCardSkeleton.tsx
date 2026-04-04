import { Skeleton } from "@/components/ui/skeleton";

function WishlistCardSkeleton() {
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm space-y-3 animate-pulse">
      {/* Title + icon */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>

      {/* Price */}
      <Skeleton className="h-5 w-1/3" />

      {/* Address */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export default WishlistCardSkeleton;