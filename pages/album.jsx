import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from "next/link"
import { FiExternalLink, FiLock, FiMail, FiShield } from 'react-icons/fi'
import MyImage from "../components/my-image";

const providerOptions = [
  ["google_drive", "Google Drive"],
  ["dropbox", "Dropbox"],
  ["onedrive", "OneDrive"],
  ["s3", "S3 or R2"],
  ["photographer_gallery", "Photographer gallery"],
  ["external_url", "Direct image URL"],
]

const fallbackImages = [
  {
    sourceUrl: "/image1.jpg",
    caption: "Demo memory placeholder",
    moderationStatus: "approved",
  },
  {
    sourceUrl: "/image2.jpg",
    caption: "Add real external references to replace this preview",
    moderationStatus: "approved",
  },
  {
    sourceUrl: "/image3.jpg",
    caption: "A gallery layout shaped for long-term remembering",
    moderationStatus: "approved",
  },
]

const Album = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { albumId } = router.query;
  const [album, setAlbum] = useState(null)
  const [images, setImages] = useState([])
  const [acceptedAttestation, setAcceptedAttestation] = useState(false)
  const [message, setMessage] = useState("")
  const [parentConsentEmail, setParentConsentEmail] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [mediaReference, setMediaReference] = useState({
    sourceUrl: "",
    thumbnailUrl: "",
    provider: "google_drive",
    caption: "",
  })
  const [bulkLinks, setBulkLinks] = useState("")

  useEffect(() => {
    if (!albumId) return

    const loadAlbum = async () => {
      try {
        const [albumResponse, imageResponse] = await Promise.all([
          axios.get(`/api/albums?id=${albumId}`),
          axios.get(`/api/images?albumId=${albumId}`),
        ])

        setAlbum(albumResponse.data)
        setImages(Array.isArray(imageResponse.data) ? imageResponse.data : [])
      } catch (error) {
        setMessage(error?.response?.data?.message || "Could not load album. Sign in or check your MongoDB connection.")
      }
    }

    loadAlbum()
  }, [albumId])

  const addMediaReference = async (event) => {
    event.preventDefault()
    setMessage("")

    if (!acceptedAttestation) {
      setMessage("Upload attestation is required before adding any image reference.")
      return
    }

    try {
      const response = await axios.post('/api/images', {
        ...mediaReference,
        albumId,
        uploadAttestationAccepted: true,
      })

      if (response.data?.image) {
        setImages((currentImages) => [response.data.image, ...currentImages])
        setMediaReference({
          sourceUrl: "",
          thumbnailUrl: "",
          provider: album?.mediaProvider || "google_drive",
          caption: "",
        })
        setMessage("Media reference added. It is marked pending moderation until a provider is connected.")
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not add media reference.")
    }
  }

  const requestPublicApproval = async (event) => {
    event.preventDefault()
    setMessage("")

    try {
      const response = await axios.post("/api/public-approvals", {
        albumId,
        parentConsentEmail,
      })
      setAlbum((currentAlbum) => ({
        ...currentAlbum,
        publicApproval: {
          ...(currentAlbum?.publicApproval || {}),
          status: "pending_email",
          approvalUrl: response.data.approval?.approvalUrl,
        },
      }))
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not request public approval.")
    }
  }

  const inviteViewer = async (event) => {
    event.preventDefault()
    setMessage("")

    try {
      const response = await axios.post("/api/invites", {
        albumId,
        invitedEmail: inviteEmail,
        role: "viewer",
      })
      setInviteEmail("")
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not create invite.")
    }
  }

  const revokePublicSharing = async () => {
    setMessage("")
    try {
      const response = await axios.put(`/api/albums?id=${albumId}`, {
        visibility: "private",
        publicApproval: { status: "revoked" },
      })
      setAlbum(response.data.album)
      setMessage("Public sharing revoked. Album is private again.")
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not revoke public sharing.")
    }
  }

  const updateImage = async (imageId, data) => {
    setMessage("")

    try {
      const response = await axios.put(`/api/images?id=${imageId}`, data)
      setImages((currentImages) => currentImages.map((image) => image._id === imageId ? response.data.image : image))
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not update image.")
    }
  }

  const importSelectedLinks = async (event) => {
    event.preventDefault()
    setMessage("")

    if (!acceptedAttestation) {
      setMessage("Upload attestation is required before importing selected images.")
      return
    }

    const links = bulkLinks.split(/\n+/).map((link) => link.trim()).filter(Boolean)

    if (!links.length) {
      setMessage("Paste one or more selected image links first.")
      return
    }

    try {
      const createdImages = []
      for (const link of links) {
        const response = await axios.post('/api/images', {
          albumId,
          sourceUrl: link,
          thumbnailUrl: link,
          provider: "google_drive",
          caption: "Selected Drive memory",
          uploadAttestationAccepted: true,
        })
        if (response.data?.image) createdImages.push(response.data.image)
      }
      setImages((currentImages) => [...createdImages, ...currentImages])
      setBulkLinks("")
      setMessage(`${createdImages.length} selected image reference${createdImages.length === 1 ? "" : "s"} imported.`)
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not import selected links.")
    }
  }

  const visibility = album?.visibility || "private"
  const approvalPending = album?.publicApproval?.status === "pending_email"
  const galleryImages = images.length ? images : fallbackImages

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400" />
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Album workspace</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950 dark:text-white">{album?.title || "Memory album"}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              {album?.description || "Build the album by attaching external media references. Toddlerfaces stores the story, permissions, and audit trail while the original files stay with the provider you choose."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                <FiLock />
                {visibility}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-sky-800 dark:bg-sky-950 dark:text-sky-100">
                <FiExternalLink />
                {album?.mediaProvider?.replaceAll("_", " ") || "external source"}
              </span>
              {approvalPending && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-100">
                  <FiMail />
                  public approval email pending
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Source of truth</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
              MongoDB stores album, image, permission, moderation, and legal audit metadata. Original media stays in Drive, Dropbox, OneDrive, S3/R2, or the photographer gallery.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Memory wall</p>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Gallery preview</h2>
            </div>
            {!images.length && (
              <p className="max-w-sm text-right text-xs text-gray-500 dark:text-gray-400">
                Showing demo placeholders until external references are added.
              </p>
            )}
          </div>
          <MyImage images={galleryImages} onUpdateImage={images.length ? updateImage : undefined} />
        </section>

        <aside className="space-y-5">
          <form onSubmit={addMediaReference} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Attach external image</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Add a direct image URL or provider reference. Google Drive folder browsing should come later through OAuth and a picker; the production default should not copy originals into app storage.
            </p>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Provider
              <select className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={mediaReference.provider} onChange={(event) => setMediaReference({ ...mediaReference, provider: event.target.value })}>
                {providerOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Image or provider URL
              <input className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={mediaReference.sourceUrl} onChange={(event) => setMediaReference({ ...mediaReference, sourceUrl: event.target.value })} placeholder="https://..." />
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Optional thumbnail URL
              <input className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={mediaReference.thumbnailUrl} onChange={(event) => setMediaReference({ ...mediaReference, thumbnailUrl: event.target.value })} placeholder="https://..." />
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Caption
              <textarea className="mt-1 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={mediaReference.caption} onChange={(event) => setMediaReference({ ...mediaReference, caption: event.target.value })} placeholder="What should this memory remember?" />
            </label>

            <label className="mt-5 flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600" checked={acceptedAttestation} onChange={(event) => setAcceptedAttestation(event.target.checked)} />
              <span>I legally attest that I am an adult, I have permission to attach this media, and it does not contain illegal, exploitative, abusive, non-consensual, nude, violent, or otherwise restricted content.</span>
            </label>

            <button className="mt-5 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400" type="submit" disabled={!session?.user || !albumId}>
              Add media reference
            </button>
          </form>

          <form onSubmit={importSelectedLinks} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Google Drive selected links</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Phase-one Drive support: paste the exact image links selected from a shared Drive folder, one per line. OAuth Picker can replace this textarea later without changing the metadata model.
            </p>
            <Link href={`/drive-picker?albumId=${albumId || ""}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              Use Google Drive Picker
            </Link>
            <textarea className="mt-4 min-h-28 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" value={bulkLinks} onChange={(event) => setBulkLinks(event.target.value)} placeholder={"https://drive.google.com/file/d/...\nhttps://drive.google.com/file/d/..."} />
            <button className="mt-3 w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={!session?.user || !albumId}>
              Import selected links
            </button>
          </form>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-gray-950 dark:text-white">
              <FiShield />
              <h2 className="text-lg font-semibold">Public safety gate</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Public visibility requires a parent/account-holder email approval. For photographer albums, enter the parent consent email here before the album can become public.
            </p>
            <form onSubmit={requestPublicApproval} className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Parent consent email
                <input className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" type="email" value={parentConsentEmail} onChange={(event) => setParentConsentEmail(event.target.value)} placeholder="parent@example.com" />
              </label>
              <button className="mt-3 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-gray-950" type="submit" disabled={!session?.user || !albumId}>
                Request public approval
              </button>
            </form>
            {album?.publicApproval?.approvalUrl && (
              <p className="mt-3 break-all rounded-md bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Approval link queued in email outbox: {album.publicApproval.approvalUrl}
              </p>
            )}
            {album?.visibility === "public" && (
              <div className="mt-4 space-y-3 rounded-md bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                <p>Public URL: /public/album/{album._id}</p>
                <button className="rounded-md bg-emerald-900 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={revokePublicSharing}>
                  Revoke public sharing
                </button>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Invite private viewer</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Invite-based sharing keeps the album private to selected users without making it public.
            </p>
            <form onSubmit={inviteViewer} className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Viewer email
                <input className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="family@example.com" />
              </label>
              <button className="mt-3 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" type="submit" disabled={!session?.user || !albumId}>
                Send invite
              </button>
            </form>
          </div>

          {message && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
              {message}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Album;
