import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from 'react';
import ToggleTheme from './ToggleTheme';


const DarkMode = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true),[]);

  const {theme, setTheme} = ToggleTheme();

  if(!mounted) return null;
  
  if (theme == "dark") {
    return (
      <SunIcon className="mx-1 w-6 text-yellow-500 " role="button" onClick={() => setTheme('light')} />
    )
  } else {
    return (
      <MoonIcon className="mx-1 w-6 text-gray-900 " role="button" onClick={() => setTheme('dark')} />
    );
  }
};

export default DarkMode;