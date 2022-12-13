import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export default function ToggleTheme() {
  const {theme, setTheme} = useTheme();
  
  const [themeValue, setThemeValue] = useState(null);
  useEffect(() => setThemeValue(theme), [theme]);

  return {theme: themeValue, setTheme};
}