const Contact = () => {
  return (
    <div className="app-container app-page">
      <div className="app-prose">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Contact</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white">Support, safety, and legal requests</h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          For support, safety concerns, deletion requests, photographer questions, or legal notices, contact the owner mailbox below.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["General support", "marveldev.io@gmail.com"],
          ["Safety reports", "marveldev.io@gmail.com"],
          ["Legal requests", "marveldev.io@gmail.com"],
        ].map(([title, email]) => (
          <div className="rounded-lg border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90" key={title}>
            <h2 className="font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{email}</p>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Contact;
