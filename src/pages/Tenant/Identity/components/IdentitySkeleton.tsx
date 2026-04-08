import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IdentitySkeleton() {
  return (
    <Card className="shadow-md rounded-2xl animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="w-full h-52 rounded-xl" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}