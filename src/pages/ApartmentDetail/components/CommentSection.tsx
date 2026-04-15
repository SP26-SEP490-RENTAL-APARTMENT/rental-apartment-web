import { formatDate } from "@/lib/utils";
import type { Review } from "@/types/review";
import { Star } from "lucide-react";

function CommentSection({ reviews }: { reviews: Review }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-lg font-bold">
            {reviews.tenantName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{reviews.tenantName}</span>
          <span>{formatDate(reviews.createdAt)}</span>
        </div>
      </div>
      <div className="flex gap-1 my-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={15}
            className={
              i < reviews.rating
                ? "text-black fill-black"
                : "text-gray-400 fill-gray-400"
            }
          />
        ))}
      </div>
      <div className="line-clamp-3">
        <p>{reviews.comment}</p>
      </div>
    </div>
  );
}

export default CommentSection;
