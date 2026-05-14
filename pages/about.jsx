const features = [
  ["For parents", "Build private family albums for birthdays, milestones, and everyday memories. Choose when something becomes shared or public."],
  ["For photographers", "Prepare client delivery albums while keeping media in your preferred storage provider."],
  ["For admins", "Support safety, moderation, role management, and operational review without letting admins self-register."],
  ["For storage", "Keep app metadata in MongoDB and original media in Drive, S3, Dropbox, OneDrive, or photographer-hosted galleries."],
]

const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">About Toddlerfaces</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">A privacy-first gallery for child photo albums.</h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Toddlerfaces is designed around a simple rule: the app should manage albums, permissions, audit records, and metadata while parents and photographers keep ownership of media in their own storage systems.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map(([title, body]) => (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950" key={title}>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
          </div>
        ))}
      </section>
    </div>
  )
};

export default About;
