import Link from "next/link";
import { useState } from 'react';
import { Logo, NavItem, DarkMode } from './'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const MENU_LIST = [
  { text: "Home", href: "/home", active: true },
  { text: "About Us", href: "/about", active: false },
  { text: "Contact", href: "/contact", active: false },
];

const initApp = () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  const toggleMenu = () => {
    mobileMenu.classList.toggle('hidden')
    mobileMenu.classList.toggle('flex')
    hamburgerBtn.classList.toggle('toggle-btn')
  }

  hamburgerBtn.addEventListener('click', toggleMenu)
  mobileMenu.addEventListener('click', toggleMenu)
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initApp);
}

const Navbar = () => {
  const { push, asPath} = useRouter();
  const { data: session } = useSession();

  const handleSignIn = () => push(`/auth-page?callbackUrl=${asPath}`)

  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 dark:bg-black">
      <Link href={"/"}>
        <Logo></Logo>
      </Link>
      <div
        onClick={() => setNavActive(!navActive)}
        className="flex py-4 cursor-pointer"
      >
        <div className={`${navActive ? "active" : ""} text-lg hidden md:inline-flex items-center mx-7 w-[calc(min-h-screen_-w-16)]`}>
          {
            MENU_LIST.map((menu, idx) => (
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
                className="px-2"
              >
                <NavItem active={activeIdx === idx} {...menu} />
              </div>
            ))
          }
        </div>
        <div className="flex items-center">

          { session && 
            <a
              className="btn"
              onClick={() => signOut()}
            >Sign Out
            </a>
          }
          { !session && 
            <a
              className="btn"
              onClick={()=>handleSignIn()}
            >Sign In
            </a>
          }
          <DarkMode />

          <button id="hamburger-btn" className="relative mx-1 w-8 h-8 md:hidden cursor-pointer text-3xl">
            <div className="absolute top-4 -mt-0.5 h-1 w-8 rounded bg-black dark:bg-white transition-all duration-500 
              before:absolute 
              before:h-1 
              before:w-8 
              before:-translate-x-4 
              before:-translate-y-3 
              before:rounded 
              before:bg-black dark:before:bg-white
              before:transition-all 
              before:duration-500 
              before:content-[''] 
              after:absolute 
              after:h-1 
              after:w-8 
              after:-translate-x-4 
              after:translate-y-3 
              after:rounded 
              after:bg-black dark:after:bg-white
              after:transition-all 
              after:duration-500 
              after:content-['']"
              >
            </div>
          </button>
        </div>

        <section id="mobile-menu" className="absolute top-32 right-0 bg-gray-300 dark:bg-black w-full flex-col justify-content-center origin-top animate-open-menu hidden">
            {/* <button className="text-8xl self-end px-6">
              &times;
            </button> */}
            <nav className="flex flex-col min-h-screen text-center py-8 " aria-label="mobile">
              <div className={`${navActive ? "active" : ""} inline-block text-5xl mx-7 w-[calc(min-h-screen_-w-16)]`}>
              {
                MENU_LIST.map((menu, idx) => (
                  <div
                    onClick={() => {
                      setActiveIdx(idx);
                      setNavActive(false);
                    }}
                    key={menu.text}
                    className="py-6"
                  >
                    <NavItem active={activeIdx === idx} {...menu} className="w-full hover:opacity-90"/>
                  </div>
                ))
              }
            </div>
          </nav>

        </section>
      </div>
    </nav>
  )
};

export default Navbar;