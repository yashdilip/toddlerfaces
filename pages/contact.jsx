const Contact = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Contact</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">Support, safety, and legal requests</h1>
      <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
        This production placeholder should be replaced with your monitored support inbox before launch.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["General support", "support@toddlerfaces.example"],
          ["Safety reports", "safety@toddlerfaces.example"],
          ["Legal requests", "legal@toddlerfaces.example"],
        ].map(([title, email]) => (
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950" key={title}>
            <h2 className="font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{email}</p>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Contact;
