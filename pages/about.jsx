const features = [
  ["For parents", "Build private family albums for birthdays, milestones, and everyday memories. Choose when something becomes shared or public."],
  ["For photographers", "Prepare client delivery albums while keeping media in your preferred storage provider."],
  ["For admins", "Review safety queues, manage roles, and support operational records from owner-granted admin access."],
  ["For storage", "Keep album records in Toddlerfaces while original media remains in Drive, S3, Dropbox, OneDrive, or photographer-hosted galleries."],
]

const About = () => {
  return (
    <div className="app-container app-page">
      <section className="max-w-3xl">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">About Toddlerfaces</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white md:text-5xl">A privacy-first gallery for child photo albums.</h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Toddlerfaces is designed around a simple rule: the app manages albums, permissions, safety records, and sharing decisions while parents and photographers keep ownership of media in their own storage systems.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map(([title, body]) => (
          <div className="rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90" key={title}>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
          </div>
        ))}
      </section>
    </div>
  )
};

export default About;
