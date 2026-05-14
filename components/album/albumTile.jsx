import { AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FiExternalLink, FiLock, FiMail, FiShare2 } from "react-icons/fi";
import React from 'react';
import Link from 'next/link';

const providerLabel = {
  google_drive: "Google Drive",
  dropbox: "Dropbox",
  onedrive: "OneDrive",
  s3: "S3 or R2",
  photographer_gallery: "Photographer gallery",
  external_url: "Direct links",
  local_dev: "Local dev",
}

const moodClass = {
  warm: "from-rose-100 via-amber-50 to-sky-100 dark:from-rose-950 dark:via-gray-950 dark:to-sky-950",
  gentle: "from-emerald-100 via-white to-sky-100 dark:from-emerald-950 dark:via-gray-950 dark:to-sky-950",
  studio: "from-gray-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950",
  bright: "from-amber-100 via-rose-50 to-cyan-100 dark:from-amber-950 dark:via-gray-950 dark:to-cyan-950",
}

const visibilityMeta = {
  private: { label: "Private", icon: FiLock, className: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200" },
  shared: { label: "Invite shared", icon: FiShare2, className: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-100" },
  public: { label: "Public", icon: FiExternalLink, className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100" },
}

const AlbumTile = ({ album, onDeleteAlbum }) => {
  const createdAt = album.createdAt ? new Date(album.createdAt).toLocaleDateString() : "Draft"
  const visibility = visibilityMeta[album.visibility] || visibilityMeta.private
  const VisibilityIcon = visibility.icon
  const approvalPending = album.publicApproval?.status === "pending_email"
  const previewClass = moodClass[album.mood] || moodClass.warm

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-900/10 dark:border-gray-800 dark:bg-gray-950/90">
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${previewClass} p-4`}>
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${visibility.className}`}>
            <VisibilityIcon size={13} />
            {visibility.label}
          </span>
          {approvalPending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm dark:bg-amber-950 dark:text-amber-100">
              <FiMail size={13} />
              Email pending
            </span>
          )}
        </div>
        <div className="grid h-full grid-cols-5 grid-rows-4 gap-2 pt-10">
          <div className="col-span-3 row-span-4 rounded-md bg-white/75 shadow-sm dark:bg-gray-950/55" />
          <div className="col-span-2 row-span-2 rounded-md bg-white/60 shadow-sm dark:bg-gray-950/45" />
          <div className="rounded-xl bg-white/60 shadow-sm dark:bg-gray-950/45" />
          <div className="rounded-xl bg-white/60 shadow-sm dark:bg-gray-950/45" />
          <div className="col-span-2 rounded-xl bg-white/50 shadow-sm dark:bg-gray-950/35" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{providerLabel[album.mediaProvider] || "External storage"}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-950 dark:text-white">{album.title || "Memory album"}</h3>
          </div>
          <div className="flex gap-1 text-gray-500 dark:text-gray-400">
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900" type="button" aria-label="Edit album">
              <BiEdit />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900" type="button" aria-label="Delete album" onClick={() => onDeleteAlbum(album._id)}>
              <AiOutlineClose />
            </button>
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {album.description || `${album.childName || "A little one"}'s ${album.occasion?.replaceAll("_", " ") || "memory"} album.`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{album.createdBy ? `By ${album.createdBy}` : "Created in Toddlerfaces"}</span>
          <span className="text-right">{createdAt}</span>
        </div>
        <Link href={`/album?albumId=${album._id}`} className="mt-5 inline-flex w-full justify-center rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400">
          Open memory
        </Link>
      </div>
    </article>
  );
};

export default AlbumTile;
