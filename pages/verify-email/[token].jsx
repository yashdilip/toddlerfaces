import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");

  const verify = async () => {
    try {
      const response = await axios.post("/api/email-verification/verify", { token });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not verify email.");
    }
  }

  return (
    <div className="app-container app-page-centered">
      <div className="app-prose rounded-lg border border-gray-200 bg-white/90 p-8 shadow-xl shadow-gray-900/5 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Email verification</p>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 dark:text-white">Verify your Toddlerfaces account</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Email verification helps protect private family albums and supports legally accountable account actions.
        </p>
        <button onClick={verify} disabled={!token} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:bg-gray-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400">
          Verify email
        </button>
        {message && <p className="mt-5 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}
      </div>
    </div>
  )
}
