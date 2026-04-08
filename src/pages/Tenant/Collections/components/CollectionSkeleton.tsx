import { Skeleton } from "@/components/ui/skeleton";

function CollectionSkeleton() {
  return (
    <div className="border-2 rounded-2xl p-5 bg-white shadow-sm animate-pulse">
      <Skeleton className="w-10 h-10 rounded-xl mb-4" />

      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default CollectionSkeleton;