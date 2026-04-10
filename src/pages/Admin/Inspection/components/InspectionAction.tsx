import type { Inspection } from "@/types/inspection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BadgeCheck, CirclePlay, Eye, NotebookPen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export interface Props {
  inspections: Inspection;
  onStartInspection: (id: string) => void;
  onInspectionForm: (id: string) => void;
  onReviewInspection: (id: string) => void;
}
function InspectionAction({
  inspections,
  onStartInspection,
  onInspectionForm,
  onReviewInspection,
}: Props) {
  const { user } = useAuthStore();
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Booking Detail
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            {/* Status + Condition */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Status</span>
              <span className="capitalize font-semibold text-green-600">
                {inspections.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">
                Condition
              </span>
              <span className="capitalize">{inspections.overallCondition}</span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Scheduled</p>
                <p className="font-medium">{inspections.scheduledDate}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="font-medium">{inspections.completedDate}</p>
              </div>
            </div>

            {/* Photos */}
            <div>
              <p className="text-muted-foreground mb-2">Photos</p>

              {inspections.photos?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {inspections.photos.map((photo: any, index: number) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-md border"
                    >
                      <img
                        src={photo.fileUrl}
                        alt={`inspection-${index}`}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No photos available
                </p>
              )}
            </div>

            {/* Issues */}
            {inspections.issuesFound && (
              <div>
                <p className="text-muted-foreground mb-1">Issues Found</p>
                <p className="bg-red-50 text-red-600 p-3 rounded-md">
                  {inspections.issuesFound}
                </p>
              </div>
            )}

            {/* Recommendation */}
            <div>
              <p className="text-muted-foreground mb-1">Recommendation</p>
              <p className="bg-muted p-3 rounded-md">
                {inspections.recommendations}
              </p>
            </div>

            {/* Approval */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Approved</span>
              <span
                className={`font-semibold ${
                  inspections.approvedForListing
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {inspections.approvedForListing ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {user?.role === "staff" && (
        <>
          {inspections.status === "scheduled" && (
            <Button
              onClick={() => onStartInspection(inspections.inspectionId)}
              size="sm"
            >
              <CirclePlay />
            </Button>
          )}

          {inspections.status === "in_progress" && (
            <Button
              onClick={() => onInspectionForm(inspections.inspectionId)}
              size="sm"
            >
              <NotebookPen />
            </Button>
          )}
        </>
      )}

      {user?.role === "admin" && (
        <>
          {inspections.status === "pending" && (
            <Button
              onClick={() => onReviewInspection(inspections.inspectionId)}
              size="sm"
            >
              <BadgeCheck />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default InspectionAction;
