export default function AdminPropertiesLoading() {
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

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        {/* Table header row */}
        <div className="border-b border-[#E8E6E3]">
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="h-4 w-20 skeleton-shimmer rounded-2xl" />
            <div className="h-4 w-24 skeleton-shimmer rounded-2xl" />
            <div className="h-4 w-28 skeleton-shimmer rounded-2xl" />
            <div className="h-4 w-16 skeleton-shimmer rounded-2xl" />
          </div>
        </div>

        {/* Table body rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-[#E8E6E3] last:border-b-0">
            <div className="grid grid-cols-4 gap-4 p-6">
              <div className="h-4 w-32 skeleton-shimmer rounded-2xl" />
              <div className="h-4 w-24 skeleton-shimmer rounded-2xl" />
              <div className="h-4 w-28 skeleton-shimmer rounded-2xl" />
              <div className="h-4 w-16 skeleton-shimmer rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
