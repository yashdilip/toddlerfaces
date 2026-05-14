const LegalPage = ({ title, subtitle, updated = "May 14, 2026", sections }) => {
  return (
    <div className="app-container app-page">
      <div className="app-prose">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Legal and safety</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">{subtitle}</p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Last updated: {updated}</p>
      </div>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <section className="rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90" key={section.heading}>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">{section.heading}</h2>
            {section.body && <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-600 dark:text-gray-300">{section.body}</p>}
            {section.items && (
              <ul className="mt-4 max-w-4xl list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
        <p className="max-w-4xl">
          This page is provided for transparency and is not legal advice. Families, photographers, and administrators remain responsible for following applicable privacy, consent, copyright, and child-safety laws.
        </p>
      </div>
    </div>
  )
}

export default LegalPage
