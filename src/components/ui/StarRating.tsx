export function StarRating({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex gap-0.5"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={rating >= star - 0.25} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-on-dark-mute">
          {rating.toFixed(1)} ({count} {count === 1 ? "Review" : "Reviews"})
        </span>
      )}
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      className={filled ? "text-gold" : "text-ink-mute"}
      fill="currentColor"
      aria-hidden
    >
      <path d="M10 1.5 12.6 7l6 .6-4.5 4 1.3 5.9L10 14.4l-5.4 3.1L5.9 11.6l-4.5-4 6-.6L10 1.5Z" />
    </svg>
  );
}
