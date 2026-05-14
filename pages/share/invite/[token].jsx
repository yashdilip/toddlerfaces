import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function InviteAcceptPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");
  const [albumId, setAlbumId] = useState("");

  const accept = async () => {
    try {
      const response = await axios.post("/api/invites/accept", { token });
      setMessage(response.data.message);
      setAlbumId(response.data.album?._id || "");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not accept invite. Sign in with the invited email address first.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Private album invite</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Accept album access</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Sign in with the email address that received this invite, then accept to add the album to your shared workspace.
        </p>
        <button onClick={accept} disabled={!token} className="mt-6 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:bg-gray-400">
          Accept invite
        </button>
        {message && <p className="mt-5 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}
        {albumId && (
          <Link href={`/album?albumId=${albumId}`} className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            Open shared album
          </Link>
        )}
      </div>
    </div>
  )
}
