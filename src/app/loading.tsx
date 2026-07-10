import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Image
          src="/brand/monogram.png"
          alt=""
          width={498}
          height={379}
          className="mx-auto h-12 w-auto opacity-90"
        />
        <div className="mx-auto mt-4 h-px w-24 overflow-hidden bg-ink-mute">
          <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] bg-gold" />
        </div>
      </div>
    </div>
  );
}
