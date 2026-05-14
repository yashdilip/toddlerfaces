import Link from "next/link"

const legalLinks = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Child Privacy", "/child-privacy"],
  ["Cookies", "/cookies"],
  ["Data Collection", "/data-collection"],
  ["Storage Strategy", "/storage-strategy"],
  ["Public Sharing", "/public-sharing-disclaimer"],
  ["Photographer Agreement", "/photographer-agreement"],
  ["Content Rights", "/content-rights"],
  ["Deletion", "/deletion-retention"],
  ["Safety", "/safety"],
]

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200/80 bg-white/82 py-12 backdrop-blur dark:border-gray-800 dark:bg-gray-950/82">
      <div className="app-container grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xl font-black tracking-tight text-gray-950 dark:text-white">Toddlerfaces</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-300">
            Thoughtful child photo albums built around family privacy, trusted storage, and careful sharing.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2 md:justify-end">
          {legalLinks.map(([label, href]) => (
            <Link href={href} key={href} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-950 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:text-white">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="app-container mt-8 border-t border-gray-200 pt-6 text-xs leading-5 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Toddlerfaces. Family gallery software for parents, photographers, and approved admins.
      </div>
    </footer>
  );
};

export default Footer;
