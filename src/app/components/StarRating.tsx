import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  showNumber?: boolean;
  count?: number;
  size?: 'xs' | 'sm' | 'md';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ rating, showNumber = true, count, size = 'sm', interactive = false, onRate }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);
  const sizeClasses = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = interactive ? star <= (hovered || rating) : star <= Math.round(rating);
        const halfFilled = !interactive && !filled && star - 0.5 <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                filled || halfFilled ? 'text-yellow-400 fill-yellow-400' : 'text-[#D1D5DB] fill-[#D1D5DB]'
              }`}
            />
          </button>
        );
      })}
      {showNumber && (
        <span className="text-sm font-medium text-[#374151] ml-0.5">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-[#9CA3AF]">({count})</span>
      )}
    </div>
  );
}
