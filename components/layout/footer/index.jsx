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
    <footer className="mt-20 border-t border-gray-200 bg-white px-4 py-10 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-lg font-bold text-gray-950 dark:text-white">Toddlerfaces</p>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-300">
            Metadata in MongoDB. Media in parent or photographer controlled storage. Private by default.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
          {legalLinks.map(([label, href]) => (
            <Link href={href} key={href} className="text-sm text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-300">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Toddlerfaces. This product is intended for adult parents, photographers, and admins.
      </div>
    </footer>
  );
};

export default Footer;
