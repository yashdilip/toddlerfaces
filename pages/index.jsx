import Image from "next/image"
import Link from "next/link"
import { Albums } from '../components'

const pillars = [
  ["Private by default", "Albums and images start private. Parents decide when sharing is worth the risk."],
  ["Bring your own storage", "Use Drive, Dropbox, OneDrive, S3/R2, or photographer galleries while Toddlerfaces stores metadata and permissions."],
  ["Audit-ready care", "Adult eligibility, upload attestations, public approvals, and moderation statuses are designed into the workflow."],
]

const moments = ["first cake", "tiny hands", "sleepy smiles", "studio day", "family visit", "three candles"]

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 opacity-70 dark:opacity-40">
          <Image src="/pexels-cottonbro-studio-8072281.jpg" alt="Family photo album background" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/30 dark:from-gray-950 dark:via-gray-950/90 dark:to-gray-950/30" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Child photo albums for families and photographers</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-gray-950 dark:text-white md:text-7xl">
              Hold the little years beautifully.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-200">
              Toddlerfaces turns externally stored photos into private-by-default memory albums with role-based access, legal attestations, and a gallery that feels worth returning to years later.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth-page" className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                Create adult account
              </Link>
              <Link href="/storage-strategy" className="rounded-md border border-gray-300 bg-white/80 px-5 py-3 text-sm font-semibold text-gray-900 backdrop-blur transition hover:bg-white dark:border-gray-700 dark:bg-gray-950/70 dark:text-gray-100 dark:hover:bg-gray-900">
                Storage approach
              </Link>
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
                  <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">Private album, public only after approval.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-black">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
          {pillars.map(([title, body]) => (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950" key={title}>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Memory language</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Albums should feel like a place, not a folder.</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
              The UI now gives each album a mood, occasion, source, privacy status, and a living mosaic. The goal is emotional durability: easy to manage today, meaningful to open years from now.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {moments.map((moment, index) => (
              <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 ${index === 0 || index === 5 ? "sm:col-span-2" : ""}`} key={moment}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Moment</p>
                <p className="mt-8 text-2xl font-bold text-gray-950 dark:text-white">{moment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Workspace</p>
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Albums</h2>
          </div>
          <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">
            Create role-aware albums, choose an external storage source, and keep public sharing behind legal and email approval steps.
          </p>
        </div>
        <Albums />
      </section>
    </div>
  );
}
