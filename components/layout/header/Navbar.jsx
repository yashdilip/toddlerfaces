import Link from "next/link";
import { useState } from 'react';
import { Logo, DarkMode } from './'
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const MENU_LIST = [
  { text: "Albums", href: "/" },
  { text: "Dashboard", href: "/dashboard" },
  { text: "About", href: "/about" },
  { text: "Storage", href: "/storage-strategy" },
  { text: "Safety", href: "/safety" },
  { text: "Contact", href: "/contact" },
];

const linkClass = (active) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    active
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:text-white"
  }`

const Navbar = () => {
  const { asPath, push } = useRouter();
  const { data: session } = useSession();
  const [navActive, setNavActive] = useState(false);

  const handleSignIn = () => push(`/auth-page?callbackUrl=${asPath}`)

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" aria-label="Toddlerfaces home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {MENU_LIST.map((menu) => (
            <Link href={menu.href} key={menu.text} className={linkClass(asPath === menu.href)}>
              {menu.text}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {session?.user?.role && (
            <span className="hidden rounded-full border border-gray-200 px-3 py-1 text-xs font-medium capitalize text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:inline-flex">
              {session.user.role}
            </span>
          )}
          {session ? (
            <button className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700" onClick={handleSignIn}>
              Sign in
            </button>
          )}
          <DarkMode />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 md:hidden dark:border-gray-800 dark:text-gray-200"
            onClick={() => setNavActive(!navActive)}
            aria-label="Open navigation"
            aria-expanded={navActive}
          >
            <span className="text-xl">{navActive ? "x" : "="}</span>
          </button>
        </div>
      </div>

      {navActive && (
        <div className="mx-auto mt-3 grid max-w-7xl gap-1 border-t border-gray-200 pt-3 md:hidden dark:border-gray-800">
          {MENU_LIST.map((menu) => (
            <Link href={menu.href} key={menu.text} className={linkClass(asPath === menu.href)} onClick={() => setNavActive(false)}>
              {menu.text}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
};

export default Navbar;
