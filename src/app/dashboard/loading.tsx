export default function DashboardLoading() {
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
        <div className="h-10 w-40 skeleton-shimmer rounded-2xl" />
      </div>

      {/* Stats cards row */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
            {/* Card label */}
            <div className="mb-3 h-4 w-1/2 skeleton-shimmer rounded-2xl" />

            {/* Card value */}
            <div className="h-8 w-2/3 skeleton-shimmer rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Section title */}
        <div className="mb-6 h-6 w-48 skeleton-shimmer rounded-2xl" />

        {/* Content lines */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-full skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
