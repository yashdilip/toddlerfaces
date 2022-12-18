import Link from "next/link";

const NavItem = ({ text, href, active }) => {
  return (
    <Link href={href} legacyBehavior>
      <a className={`hover:font-bold relative transition-all hover:before:w-full before:-bottom-4 before:w-0 before:h-1 before:left-0 before:absolute before:bg-black before:transition-all nav__link ${active ? "active" : ""}`}>{text}</a>
    </Link>
  )
};

export default NavItem;