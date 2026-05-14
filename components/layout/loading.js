export default function Loading() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
      Preparing
    </div>
  )
}
