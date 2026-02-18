export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .skeleton-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            #E8E6E3 25%,
            #F0EEEB 50%,
            #E8E6E3 75%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-48 skeleton-shimmer rounded-2xl" />
      </div>

      {/* Grid of listing card skeletons */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
            {/* Image placeholder */}
            <div className="mb-4 h-40 w-full skeleton-shimmer rounded-2xl" />

            {/* Title skeleton */}
            <div className="mb-3 h-5 w-3/4 skeleton-shimmer rounded-2xl" />

            {/* Description skeleton */}
            <div className="mb-4 h-4 w-full skeleton-shimmer rounded-2xl" />

            {/* Footer info skeleton */}
            <div className="flex justify-between">
              <div className="h-4 w-1/3 skeleton-shimmer rounded-2xl" />
              <div className="h-4 w-1/4 skeleton-shimmer rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
