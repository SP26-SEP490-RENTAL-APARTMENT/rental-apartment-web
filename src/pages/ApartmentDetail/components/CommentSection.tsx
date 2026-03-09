import { Star } from "lucide-react";

interface CommentSectionProps {
  guest: {
    name: string;
    avatarUrl: string;
    comment: string;
    time: string;
    rate: number;
  };
}
function CommentSection({ guest }: CommentSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <img
          className="w-15 h-15 rounded-full object-cover border-2"
          src={guest.avatarUrl}
          alt={guest.name}
        />
        <div className="flex flex-col">
          <span className="font-bold">{guest.name}</span>
          <span>{guest.time}</span>
        </div>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < guest.rate
                ? "text-yellow-500 fill-yellow-500"
                : "text-black fill-black"
            }
          />
        ))}
      </div>
      <div className="mt-2 line-clamp-3">
        <p>{guest.comment}</p>
      </div>
    </div>
  );
}

export default CommentSection;
