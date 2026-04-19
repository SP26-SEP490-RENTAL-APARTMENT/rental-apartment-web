import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AverageRating, Review } from "@/types/review";
import CommentSection from "./CommentSection";
import ReviewSummary from "./ReviewSummary";

export interface Props {
  open: boolean;
  onClose: () => void;
  reviews: Review[];
  averageRating: AverageRating;
}
function AllReviewsDialog({ open, onClose, reviews, averageRating }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="z-50 max-w-none! w-[55vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All the reviews</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
          <ReviewSummary averageData={averageRating} reviews={reviews} />
          {reviews.map((review) => (
            <div key={review.reviewId} className="p-5">
              <CommentSection reviews={review} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AllReviewsDialog;
