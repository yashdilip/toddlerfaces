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
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Email verification</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Verify your Toddlerfaces account</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Email verification helps protect private family albums and supports legally accountable account actions.
        </p>
        <button onClick={verify} disabled={!token} className="mt-6 rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:bg-gray-400">
          Verify email
        </button>
        {message && <p className="mt-5 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}
      </div>
    </div>
  )
}
