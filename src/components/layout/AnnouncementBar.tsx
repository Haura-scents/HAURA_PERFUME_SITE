export function AnnouncementBar() {
  return (
    <div className="bg-ink-soft border-b border-ink-mute py-2 text-center">
      <p className="text-eyebrow text-champagne">
        {/* TODO(phase 3): read threshold from shipping_rules */}
        Complimentary shipping on qualifying orders
      </p>
    </div>
  );
}
