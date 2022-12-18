import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'
import { Image } from 'next/image'

const DarkMode = () => {
  const [ mounted, setMounted ] = useState(false)
  const { theme, setTheme } = useTheme()
  let { resolvedTheme } = useTheme()

  useEffect(() => {
    setTheme(theme);
  }, [theme])

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <></>
  }

  let icon

  switch (resolvedTheme) {
    case 'light':
      icon = <MoonIcon className="mx-1 w-6 text-gray-900 " role="button" onClick={() => setTheme('dark')} />
      break
    case 'dark':
      icon = <SunIcon className="mx-1 w-6 text-yellow-500" role="button" onClick={() => setTheme('light')} />
      break
    default:
      icon = <Image alt="system" src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' width={400} height={400} />
      break
  }

  return icon;
};

export default DarkMode;