import {useTheme} from "next-themes";
import React, {useEffect, useState} from "react";

export default function useToggleTheme() {
  const {systemTheme, theme, setTheme} = useTheme();
  
  const [themeValue, setThemeValue] = useState(null);
  useEffect(() => setThemeValue(theme), [theme]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true),[]);

  return {systemTheme, theme: themeValue, setTheme, mounted};
}