import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "./Logo";
import NavItem from "./NavItem";

const MENU_LIST = [
  {text: "Home", href: "/", active: true},
  {text: "About Us", href: "/about", active: false},
  {text: "Contact", href: "/contact", active: false},
];

const NavBar = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <header>
      <nav className="{`nav`}">
        <Link href={"/"} legacyBehavior>
          <a>
            <h1 className="logo">toddlerfaces</h1>
          </a>
        </Link>
        <div
          onClick={() => setNavActive(!navActive)}
          className="{`nav__menu-bar`}"
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={`${navActive ? "active" : ""} nav__menu-list`}>
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
          </div>
      </nav>
    </header>
  )

};

export default NavBar;