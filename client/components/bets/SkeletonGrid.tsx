"use client"

export default function SkeletonGrid() {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-5 w-16 bg-white/10 rounded" />
          </div>
          <div className="mt-3 h-4 w-24 bg-white/10 rounded" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-white/10 rounded" />
          </div>
          <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
            <div className="h-4 w-2/3 bg-white/10 rounded" />
            <div className="h-4 w-1/2 bg-white/10 rounded" />
          </div>
        </li>
      ))}
    </ul>
  )
}
