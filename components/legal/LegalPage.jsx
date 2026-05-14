const LegalPage = ({ title, subtitle, updated = "May 14, 2026", sections }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Legal and safety</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">{subtitle}</p>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated: {updated}</p>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950" key={section.heading}>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">{section.heading}</h2>
            {section.body && <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{section.body}</p>}
            {section.items && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
        This page is product-ready placeholder language and should be reviewed by a qualified attorney before public launch.
      </p>
    </div>
  )
}

export default LegalPage
