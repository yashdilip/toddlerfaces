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

const fieldClass = "mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
const textareaClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-200"
const primaryButtonClass = "w-full rounded-full bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"

const fallbackImages = [
  {
    sourceUrl: "/image1.jpg",
    caption: "A first memory for the album wall",
    moderationStatus: "approved",
  },
  {
    sourceUrl: "/image2.jpg",
    caption: "A quiet moment ready to be preserved",
    moderationStatus: "approved",
  },
  {
    sourceUrl: "/image3.jpg",
    caption: "A milestone worth returning to",
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
        setMessage(error?.response?.data?.message || "We could not open this album right now. Please sign in and try again.")
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
        setMessage("Image reference added. It will stay under review before any public sharing.")
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
    <div className="app-container app-page">
      <section className="relative overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400" />
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Album workspace</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950 dark:text-white">{album?.title || "Memory album"}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              {album?.description || "Build the album by attaching external image links. Toddlerfaces keeps the album story, permissions, and sharing history while the original files stay with the provider you choose."}
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

          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Where photos live</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
              Toddlerfaces keeps the album story, permissions, safety status, and sharing history. Original media stays with the storage provider chosen by the family or photographer.
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
                Showing a preview memory wall until images are added.
              </p>
            )}
          </div>
          <MyImage images={galleryImages} onUpdateImage={images.length ? updateImage : undefined} />
        </section>

        <aside className="space-y-5">
          <form onSubmit={addMediaReference} className="rounded-lg border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Attach external image</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Add an image link from the selected storage provider. Toddlerfaces keeps the reference and review status without copying the original file into app storage.
            </p>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Provider
              <select className={fieldClass} value={mediaReference.provider} onChange={(event) => setMediaReference({ ...mediaReference, provider: event.target.value })}>
                {providerOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Image or provider URL
              <input className={fieldClass} value={mediaReference.sourceUrl} onChange={(event) => setMediaReference({ ...mediaReference, sourceUrl: event.target.value })} placeholder="Paste the image link" />
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Optional thumbnail URL
              <input className={fieldClass} value={mediaReference.thumbnailUrl} onChange={(event) => setMediaReference({ ...mediaReference, thumbnailUrl: event.target.value })} placeholder="Paste a thumbnail link when available" />
            </label>

            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Caption
              <textarea className={`${textareaClass} min-h-20`} value={mediaReference.caption} onChange={(event) => setMediaReference({ ...mediaReference, caption: event.target.value })} placeholder="What should this memory remember?" />
            </label>

            <label className="mt-5 flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600" checked={acceptedAttestation} onChange={(event) => setAcceptedAttestation(event.target.checked)} />
              <span>I legally attest that I am an adult, I have permission to attach this media, and it does not contain illegal, exploitative, abusive, non-consensual, nude, violent, or otherwise restricted content.</span>
            </label>

            <button className={`mt-5 ${primaryButtonClass}`} type="submit" disabled={!session?.user || !albumId}>
              Add media reference
            </button>
          </form>

          <form onSubmit={importSelectedLinks} className="rounded-lg border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Google Drive selected links</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Paste selected Drive image links, one per line, or use the picker to choose images from a connected Drive account.
            </p>
            <Link href={`/drive-picker?albumId=${albumId || ""}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              Use Google Drive Picker
            </Link>
            <textarea className={`${textareaClass} mt-4 min-h-28`} value={bulkLinks} onChange={(event) => setBulkLinks(event.target.value)} placeholder={"Paste one selected Drive image link per line"} />
            <button className={`mt-3 ${primaryButtonClass}`} type="submit" disabled={!session?.user || !albumId}>
              Import selected links
            </button>
          </form>

          <div className="rounded-lg border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
            <div className="flex items-center gap-2 text-gray-950 dark:text-white">
              <FiShield />
              <h2 className="text-lg font-semibold">Public safety gate</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Public visibility requires a parent/account-holder email approval. For photographer albums, enter the parent consent email here before the album can become public.
            </p>
            <form onSubmit={requestPublicApproval} className="mt-4">
              <label className={labelClass}>
                Parent consent email
                <input className={fieldClass} type="email" value={parentConsentEmail} onChange={(event) => setParentConsentEmail(event.target.value)} placeholder="Parent email address" />
              </label>
              <button className={`mt-3 ${primaryButtonClass}`} type="submit" disabled={!session?.user || !albumId}>
                Request public approval
              </button>
            </form>
            {album?.publicApproval?.approvalUrl && (
              <p className="mt-3 break-all rounded-md bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Approval email is ready to send: {album.publicApproval.approvalUrl}
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

          <div className="rounded-lg border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Invite private viewer</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Invite-based sharing keeps the album private to selected users without making it public.
            </p>
            <form onSubmit={inviteViewer} className="mt-4">
              <label className={labelClass}>
                Viewer email
                <input className={fieldClass} type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Viewer email address" />
              </label>
              <button className={`mt-3 ${primaryButtonClass}`} type="submit" disabled={!session?.user || !albumId}>
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
