import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ApartmentCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="w-full h-52" />

      <CardHeader>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="border-b pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />

        <div className="flex items-center mt-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-10 ml-2" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-10" />
      </CardFooter>
    </Card>
  );
}

export default ApartmentCardSkeleton;