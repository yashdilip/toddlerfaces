import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-950 dark:text-white">Page not found</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">The page may have moved, or the album/privacy link may no longer be available.</p>
      <Link href="/" className="mt-8 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
        Back to albums
      </Link>
    </div>
  )
};

export default ErrorPage;
