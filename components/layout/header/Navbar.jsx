import Link from "next/link";
import { useState } from 'react';
import { Logo, DarkMode } from './'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiMenu, FiX } from "react-icons/fi";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Storage", href: "/storage-strategy" },
  { text: "Safety", href: "/safety" },
  { text: "Contact", href: "/contact" },
];

const linkClass = (active) =>
  `rounded-full px-3 py-2 text-sm font-semibold transition ${
    active
      ? "bg-indigo-600 text-white shadow-sm dark:bg-indigo-500"
      : "text-gray-700 hover:bg-white hover:text-gray-950 dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:text-white"
  }`

const Navbar = () => {
  const { pathname, asPath, push } = useRouter();
  const { data: session } = useSession();
  const [navActive, setNavActive] = useState(false);

  const handleSignIn = () => push(`/auth-page?callbackUrl=${asPath}`)
  const isActive = (href) => href === "/#albums" ? asPath === "/#albums" : pathname === href
  const menuItems = session
    ? [
      ...MENU_LIST,
      { text: "Dashboard", href: "/dashboard" },
      { text: "Albums", href: "/#albums" },
    ]
    : MENU_LIST

  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/82 py-3 shadow-sm shadow-gray-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/82">
      <div className="app-container flex items-center justify-between gap-4">
        <Link href="/" aria-label="Toddlerfaces home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-gray-200/80 bg-gray-50/80 p-1 dark:border-gray-800 dark:bg-gray-900/70 md:flex">
          {menuItems.map((menu) => (
            <Link href={menu.href} key={menu.text} className={linkClass(isActive(menu.href))}>
              {menu.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {session?.user?.role && (
            <span className="hidden rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-semibold capitalize text-gray-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300 sm:inline-flex">
              {session.user.role}
            </span>
          )}
          {session ? (
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400" onClick={handleSignIn}>
              Sign in
            </button>
          )}
          <DarkMode />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 md:hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            onClick={() => setNavActive(!navActive)}
            aria-label="Open navigation"
            aria-expanded={navActive}
          >
            {navActive ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {navActive && (
        <div className="app-container mt-3 grid gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg md:hidden dark:border-gray-800 dark:bg-gray-950">
          {menuItems.map((menu) => (
            <Link href={menu.href} key={menu.text} className={linkClass(isActive(menu.href))} onClick={() => setNavActive(false)}>
              {menu.text}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
};

export default Navbar;
