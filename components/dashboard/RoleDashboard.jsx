import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const cardClass = "rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950";

export default function RoleDashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [moderationQueue, setModerationQueue] = useState([]);
  const [emailProcessResults, setEmailProcessResults] = useState([]);
  const [childForm, setChildForm] = useState({ name: "", birthMonth: "", birthYear: "", notes: "" });
  const [message, setMessage] = useState("");

  const role = session?.user?.role || "guest";

  useEffect(() => {
    if (!session?.user) return;

    const load = async () => {
      const results = await Promise.allSettled([
        ["parent", "admin"].includes(role) ? axios.get("/api/children") : Promise.resolve({ data: [] }),
        ["photographer", "admin"].includes(role) ? axios.get("/api/public-approvals") : Promise.resolve({ data: [] }),
        role === "admin" ? axios.get("/api/audit") : Promise.resolve({ data: [] }),
        role === "admin" ? axios.get("/api/moderation") : Promise.resolve({ data: [] }),
      ]);

      if (results[0].status === "fulfilled") setChildren(results[0].value.data);
      if (results[1].status === "fulfilled") setApprovals(results[1].value.data);
      if (results[2].status === "fulfilled") setAuditLogs(results[2].value.data);
      if (results[3].status === "fulfilled") setModerationQueue(results[3].value.data);
    }

    load();
  }, [role, session?.user]);

  const createChild = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("/api/children", childForm);
      setChildren((current) => [response.data.child, ...current]);
      setChildForm({ name: "", birthMonth: "", birthYear: "", notes: "" });
      setMessage("Child profile created.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not create child profile.");
    }
  }

  const reviewImage = async (imageId, moderationStatus) => {
    setMessage("");

    try {
      const response = await axios.put(`/api/moderation?id=${imageId}`, { moderationStatus });
      setModerationQueue((current) => current.filter((image) => image._id !== imageId));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not update moderation status.");
    }
  }

  const processEmailOutbox = async () => {
    setMessage("");

    try {
      const response = await axios.post("/api/email-outbox/process", { limit: 25 });
      setEmailProcessResults(response.data.results || []);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Could not process email outbox.");
    }
  }

  if (status === "loading") {
    return <div className={cardClass}>Loading dashboard...</div>
  }

  if (!session?.user) {
    return (
      <div className={cardClass}>
        <h1 className="text-2xl font-bold text-gray-950 dark:text-white">Sign in required</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Role dashboards are available after login.</p>
        <Link href="/auth-page" className="mt-5 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400" />
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{role} dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">Welcome, {session.user.username || session.user.email}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          Manage child profiles, memory albums, sharing approvals, and the audit trail from one role-aware workspace.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Albums</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Create, open, invite, attach external media, and request public approval.</p>
          <Link href="/" className="mt-5 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-gray-950">
            Open albums
          </Link>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Storage</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Use external media references first; Drive picker/OAuth can build on this foundation.</p>
          <Link href="/storage-strategy" className="mt-5 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            Storage strategy
          </Link>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Moderation</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">Automated provider is a future TODO. Admin manual review gates public sharing today.</p>
        </div>
      </div>

      {["parent", "admin"].includes(role) && (
        <section className={cardClass}>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Child profiles</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {children.length ? children.map((child) => (
                  <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900" key={child._id}>
                    <p className="font-semibold text-gray-950 dark:text-white">{child.name}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{child.birthMonth || "--"}/{child.birthYear || "----"}</p>
                    {child.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{child.notes}</p>}
                  </div>
                )) : (
                  <p className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">No child profiles yet.</p>
                )}
              </div>
            </div>
            <form onSubmit={createChild} className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-950 dark:text-white">Add child profile</h3>
              <input className="mt-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" placeholder="Child name" value={childForm.name} onChange={(event) => setChildForm({ ...childForm, name: event.target.value })} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" placeholder="Birth month" value={childForm.birthMonth} onChange={(event) => setChildForm({ ...childForm, birthMonth: event.target.value })} />
                <input className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" placeholder="Birth year" value={childForm.birthYear} onChange={(event) => setChildForm({ ...childForm, birthYear: event.target.value })} />
              </div>
              <textarea className="mt-3 min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white" placeholder="Notes" value={childForm.notes} onChange={(event) => setChildForm({ ...childForm, notes: event.target.value })} />
              <button className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" type="submit">Create profile</button>
            </form>
          </div>
        </section>
      )}

      {["photographer", "admin"].includes(role) && (
        <section className={cardClass}>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Public approval requests</h2>
          <div className="mt-4 grid gap-3">
            {approvals.length ? approvals.map((approval) => (
              <div className="rounded-md border border-gray-200 p-4 text-sm dark:border-gray-800" key={approval._id}>
                <p className="font-semibold capitalize text-gray-950 dark:text-white">{approval.status}</p>
                <p className="mt-1 text-gray-600 dark:text-gray-300">Parent consent: {approval.parentConsentEmail}</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Expires: {new Date(approval.expiresAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-gray-600 dark:text-gray-300">No approval requests yet.</p>}
          </div>
        </section>
      )}

      {role === "admin" && (
        <section className={cardClass}>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Email outbox</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Deliver queued verification, invite, and public consent emails through Resend, SendGrid, or console mode.
          </p>
          <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white" type="button" onClick={processEmailOutbox}>
            Process queued emails
          </button>
          {emailProcessResults.length > 0 && (
            <div className="mt-4 grid gap-2">
              {emailProcessResults.map((result) => (
                <p className="rounded-md bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300" key={result.id}>
                  {result.id}: {result.status}{result.error ? ` - ${result.error}` : ""}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {role === "admin" && (
        <section className={cardClass}>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Moderation queue</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Placeholder provider mode: review pending media manually. Public approval cannot complete until images are approved.
          </p>
          <div className="mt-4 grid gap-3">
            {moderationQueue.length ? moderationQueue.map((image) => (
              <div className="rounded-md border border-gray-200 p-4 text-sm dark:border-gray-800" key={image._id}>
                <p className="font-semibold text-gray-950 dark:text-white">{image.caption || "Untitled image"}</p>
                <p className="mt-1 break-all text-xs text-gray-500 dark:text-gray-400">{image.sourceUrl}</p>
                <p className="mt-2 capitalize text-gray-600 dark:text-gray-300">{image.moderationStatus?.replaceAll("_", " ")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={() => reviewImage(image._id, "approved")}>Approve</button>
                  <button className="rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={() => reviewImage(image._id, "needs_review")}>Needs review</button>
                  <button className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white" type="button" onClick={() => reviewImage(image._id, "blocked")}>Block</button>
                </div>
              </div>
            )) : <p className="text-sm text-gray-600 dark:text-gray-300">No pending moderation items.</p>}
          </div>
        </section>
      )}

      {role === "admin" && (
        <section className={cardClass}>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Audit log</h2>
          <div className="mt-4 max-h-96 overflow-auto rounded-md border border-gray-200 dark:border-gray-800">
            {auditLogs.length ? auditLogs.map((log) => (
              <div className="border-b border-gray-200 p-3 text-sm last:border-b-0 dark:border-gray-800" key={log._id}>
                <p className="font-semibold text-gray-950 dark:text-white">{log.action}</p>
                <p className="text-gray-600 dark:text-gray-300">{log.actorEmail || "system"} - {new Date(log.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="p-4 text-sm text-gray-600 dark:text-gray-300">No audit logs yet.</p>}
          </div>
        </section>
      )}

      {message && <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">{message}</p>}
    </div>
  )
}
