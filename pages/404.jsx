import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="app-container app-page-centered items-center text-center">
      <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">404</p>
      <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white">Page not found</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">The page may have moved, or the album/privacy link may no longer be available.</p>
      <Link href="/#albums" className="mt-8 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400">
        Back to albums
      </Link>
    </div>
  )
};

export default ErrorPage;
