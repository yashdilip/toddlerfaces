import Link from "next/link";

import { useEffect, useState } from 'react';
import { Logo, NavItem, DarkMode } from './'

const MENU_LIST = [
  { text: "Home", href: "/home", active: true },
  { text: "About Us", href: "/about", active: false },
  { text: "Contact", href: "/contact", active: false },
];

const Navbar = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 dark:bg-black">
      <Link href={"/"}>
        <Logo></Logo>
      </Link>
      <div
        onClick={() => setNavActive(!navActive)}
        className="flex py-4 cursor-pointer invisible sm:visible"
      >
        <div className={`${navActive ? "active" : ""} inline-flex items-center mx-7 w-[calc(min-h-screen_-w-16)]`}>
          {
            MENU_LIST.map((menu, idx) => (
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={menu.text}
              >
                <NavItem active={activeIdx === idx} {...menu} />
              </div>
            ))
          }

          <div>
            <a
              href="/api/login"
              className="btn"
            >Login
            </a>

            <a
              href="/api/logout"
              className="btn"
            >Logout
            </a>
          </div>

          <div>
            <DarkMode />
          </div>
        </div>
      </div>
    </nav>
  )
};

export default Navbar;