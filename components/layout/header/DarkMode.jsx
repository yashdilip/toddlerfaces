import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'
import { BsFillSunFill, BsFillMoonStarsFill } from 'react-icons/bs';

const DarkMode = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="h-10 w-10" aria-hidden="true" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {isDark ? <BsFillSunFill className="text-yellow-400" /> : <BsFillMoonStarsFill />}
    </button>
  )
};

export default DarkMode;
