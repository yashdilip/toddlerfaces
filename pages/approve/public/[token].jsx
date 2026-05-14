import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function PublicApprovalPage() {
  const router = useRouter();
  const { token } = router.query;
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [albumId, setAlbumId] = useState("");

  const approve = async () => {
    try {
      const response = await axios.post("/api/public-approvals/approve", { token, consentAccepted });
      setMessage(response.data.message);
      setAlbumId(response.data.album?._id || "");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not approve public sharing.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">Parent consent required</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Approve public album sharing</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Public child albums may be viewable by anyone with the public link. Approve only if you are the parent, guardian, or authorized account holder and you understand the privacy risk.
        </p>
        <label className="mt-6 flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} />
          <span>I consent to make this album public and understand this action will be recorded for legal and audit purposes.</span>
        </label>
        <button onClick={approve} disabled={!token || !consentAccepted} className="mt-6 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:bg-gray-400">
          Approve public sharing
        </button>
        {message && <p className="mt-5 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}
        {albumId && (
          <Link href={`/album?albumId=${albumId}`} className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            Open album
          </Link>
        )}
      </div>
    </div>
  )
}
