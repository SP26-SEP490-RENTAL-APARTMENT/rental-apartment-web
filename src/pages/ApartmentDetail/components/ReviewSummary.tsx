import { Progress } from "@/components/ui/progress";
import type { AverageRating, Review } from "@/types/review";
import { Star } from "lucide-react";

interface Props {
  reviews: Review[];
  averageData: AverageRating;
}

export default function ReviewSummary({ reviews, averageData }: Props) {
  const { averageRating, totalReviews } = averageData;

  // Đếm số lượng từng mức sao (5 -> 1)
  const ratingCount = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: totalReviews ? (count / totalReviews) * 100 : 0,
    };
  });

  return (
    <div className="flex gap-8 p-6 border rounded-2xl shadow-sm bg-white">
      {/* LEFT */}
      <div className="flex flex-col justify-center items-center min-w-30">
        <div className="text-5xl font-bold">{averageRating?.toFixed(1)}</div>
        <div className="text-sm text-muted-foreground mt-3">
          {totalReviews} reviews
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 space-y-3">
        {ratingCount.map((item) => (
          <div key={item.star} className="flex items-center gap-3">
            {/* Star label */}
            <div className="w-8 flex items-center gap-1">
              <span className="text-xl font-medium ">{item.star}</span>
              <Star className="fill-black" size={14} />
            </div>

            {/* Progress */}
            <Progress value={item.percent} className="h-2 flex-1" />

            {/* Count */}
            <div className="w-10 text-sm text-right text-muted-foreground">
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
