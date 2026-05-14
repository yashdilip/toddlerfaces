import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Albums } from '../components'

const pillars = [
  ["A private starting point", "Albums begin as a quiet family space. Sharing is a deliberate choice, not the default setting."],
  ["Photos stay where families keep them", "Connect Drive, Dropbox, OneDrive, S3/R2, or photographer galleries while Toddlerfaces organizes album details and permissions."],
  ["Built for sensitive memories", "Public sharing, media review, and consent steps are woven into the workflow so child photos are handled with care."],
]

const moments = ["first cake", "tiny hands", "sleepy smiles", "studio day", "family visit", "three candles"]
const roleSteps = [
  ["1", "Choose your role", "Parents and photographers start with the workspace that matches how they care for the album."],
  ["2", "Shape the album", "Add the occasion, child profile, mood, privacy, and source details that make the collection feel personal."],
  ["3", "Connect selected photos", "Reference images from trusted storage without turning Toddlerfaces into the permanent media vault."],
  ["4", "Share with intention", "Invite trusted viewers privately, or request public sharing only after the right approvals are complete."],
]

export default function Home() {
  const { data: session } = useSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <div>
      <section className="relative overflow-hidden border-b border-gray-200/80 bg-white/70 dark:border-gray-800 dark:bg-gray-950/70">
        <div className="absolute inset-0 opacity-75 dark:opacity-45">
          <Image src="/pexels-cottonbro-studio-8072281.jpg" alt="Family photo album background" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/35 dark:from-gray-950 dark:via-gray-950/90 dark:to-gray-950/35" />
        </div>

        <div className="app-container relative grid min-h-[calc(100vh-88px)] gap-10 py-14 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Child photo albums for families and photographers</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight text-gray-950 dark:text-white md:text-7xl">
              Hold the little years beautifully.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-200">
              Toddlerfaces turns externally stored photos into thoughtful memory albums, with careful access, graceful galleries, and sharing controls designed for families.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={isAuthenticated ? "/dashboard" : "/auth-page"} className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                {isAuthenticated ? "Open dashboard" : "Create account"}
              </Link>
              {isAuthenticated && (
                <Link href="#albums" className="rounded-full border border-gray-300 bg-white/80 px-5 py-3 text-sm font-bold text-gray-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:bg-gray-900">
                  Open albums
                </Link>
              )}
              <Link href="/storage-strategy" className="rounded-full px-5 py-3 text-sm font-bold text-gray-700 transition hover:text-gray-950 dark:text-gray-200 dark:hover:text-white">
                Storage approach
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Family roles", "External photo storage", "Careful public sharing"].map((item) => (
                <div className="rounded-md border border-white/80 bg-white/70 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-950/60 dark:text-gray-200" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/70 bg-white/70 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-gray-950/55">
              <div className="grid h-full grid-cols-6 grid-rows-6 gap-3">
                <div className="col-span-4 row-span-4 overflow-hidden rounded-md">
                  <Image src="/image1.jpg" alt="Birthday memory" width={600} height={600} className="h-full w-full object-cover" />
                </div>
                <div className="col-span-2 row-span-3 overflow-hidden rounded-md">
                  <Image src="/image2.jpg" alt="Family memory" width={300} height={400} className="h-full w-full object-cover" />
                </div>
                <div className="col-span-2 row-span-3 overflow-hidden rounded-md">
                  <Image src="/image3.jpg" alt="Milestone memory" width={300} height={400} className="h-full w-full object-cover" />
                </div>
                <div className="col-span-4 row-span-2 rounded-md bg-gradient-to-br from-amber-100 to-rose-100 p-4 dark:from-amber-950 dark:to-rose-950">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Memory reel</p>
                  <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">A family album with room for every small detail.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200/80 bg-white/60 dark:border-gray-800 dark:bg-gray-950/40">
        <div className="app-container grid gap-4 py-10 md:grid-cols-3">
          {pillars.map(([title, body]) => (
            <div className="rounded-md border border-gray-200 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/85" key={title}>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="app-container py-12">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Memory language</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white">Albums should feel like a place, not a folder.</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Each album carries the occasion, mood, source, privacy, and photo rhythm around the memories themselves. It should feel simple today and still meaningful years from now.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {moments.map((moment, index) => (
              <div className={`rounded-md border border-gray-200 bg-white/85 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950/85 ${index === 0 || index === 5 ? "sm:col-span-2" : ""}`} key={moment}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Moment</p>
                <p className="mt-8 text-2xl font-bold text-gray-950 dark:text-white">{moment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          {roleSteps.map(([step, title, body]) => (
            <div className="rounded-md border border-gray-200 bg-white/85 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950/85" key={step}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white dark:bg-indigo-500 dark:text-white">{step}</span>
              <h3 className="mt-4 font-semibold text-gray-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated ? (
        <section id="albums" className="app-container scroll-mt-24 pb-16 pt-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Workspace</p>
              <h2 className="text-3xl font-black tracking-tight text-gray-950 dark:text-white">Albums</h2>
            </div>
            <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">
              Create albums, choose an external storage source, arrange the gallery, and manage private or public sharing from one protected workspace.
            </p>
          </div>
          <Albums />
        </section>
      ) : (
        <section className="app-container pb-16 pt-10">
          <div className="rounded-lg border border-gray-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/85 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Start privately</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white">Your albums begin inside a protected workspace.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                Sign in to create child profiles, connect selected storage links, arrange images, and decide how each album should be shared.
              </p>
            </div>
            <Link href="/auth-page" className="mt-5 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 md:mt-0">
              Sign in to create albums
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
