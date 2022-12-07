import Link from "next/link";

const NavItem = ({text, href, active}) => {
  return (
    <Link href={href} legacyBehavior>
      <a className={`nav__link ${ active ? "active" : "" }`}>{text}</a>
    </Link>
  )
};

export default NavItem;