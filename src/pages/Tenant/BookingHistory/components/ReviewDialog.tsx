import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { reviewApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

export function ReviewDialog({ open, onClose, bookingId }: ReviewDialogProps) {
  const { t } = useTranslation("user");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setIsLoading(true);
      await reviewApi.postReview({
        bookingId,
        rating,
        comment: comment.trim(),
      });
      toast.success(t("review.success"));
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("review.failure"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("review.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("review.rating")}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={isLoading}
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="text-sm font-medium text-muted-foreground mb-2 block"
            >
              {t("review.comment")}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("review.placeholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-25 resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 {t("review.character")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
            >
              {t("review.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("review.submit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
