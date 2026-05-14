import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import AlbumTile from '../album/albumTile';
import { fetchAlbums, onCreateAlbum, onDeleteAlbum } from '../../service/album-service';

const providerOptions = [
  ["google_drive", "Google Drive"],
  ["dropbox", "Dropbox"],
  ["onedrive", "OneDrive"],
  ["s3", "S3 or R2"],
  ["photographer_gallery", "Photographer gallery"],
  ["external_url", "Direct image links"],
]

const occasionOptions = [
  ["birthday", "Birthday"],
  ["milestone", "Milestone"],
  ["family", "Family"],
  ["photographer_delivery", "Photographer delivery"],
  ["school", "School"],
  ["custom", "Custom"],
]

const fieldClass = "mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
const textareaClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-200"

const EmptyAlbumPlaceholder = ({ canCreate }) => (
  <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-950/90">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400" />
    <div className="mx-auto grid h-40 max-w-md grid-cols-4 gap-3">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div className={`rounded-md bg-gradient-to-br shadow-inner ${item % 3 === 0 ? "from-rose-100 to-amber-100 dark:from-rose-950 dark:to-amber-950" : item % 3 === 1 ? "from-sky-100 to-emerald-100 dark:from-sky-950 dark:to-emerald-950" : "from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950"}`} key={item} />
      ))}
    </div>
    <h3 className="mt-6 text-xl font-semibold text-gray-950 dark:text-white">No albums yet</h3>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
      Start with a birthday, milestone, family collection, or photographer delivery. Toddlerfaces keeps metadata here and points to media in your chosen storage.
    </p>
    {!canCreate && (
        <p className="mx-auto mt-4 max-w-lg rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-100">
        Sign in as a parent or photographer to create a memory album.
      </p>
    )}
  </div>
)

const AlbumTiles = () => {
  const { data: session } = useSession();
  const canCreate = ["parent", "photographer", "admin"].includes(session?.user?.role);
  const [albums, setAlbums] = useState([]);
  const [children, setChildren] = useState([]);
  const [serverMessage, setServerMessage] = useState('');
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    childName: '',
    occasion: 'birthday',
    description: '',
    mediaProvider: 'google_drive',
    mediaSourceUrl: '',
    visibility: 'private',
    mood: 'warm',
    childId: '',
  });

  const roleCopy = useMemo(() => {
    if (session?.user?.role === "photographer") return "Create a delivery album, attach the client-approved source, and keep the set private until the parent approves sharing.";
    if (session?.user?.role === "admin") return "Admin accounts can review albums, safety states, and operational records after being granted access by the owner.";
    return "Create albums for birthdays, milestones, and the little everyday scenes you want to keep easy to revisit.";
  }, [session?.user?.role]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAlbums();
      setAlbums(Array.isArray(data) ? data : []);
      if (session?.user && ["parent", "admin"].includes(session.user.role)) {
        try {
          const childResponse = await axios.get("/api/children");
          setChildren(Array.isArray(childResponse.data) ? childResponse.data : []);
        } catch (error) {
          setChildren([]);
        }
      }
    };

    fetchData();
  }, [session?.user]);

  const handleCreateAlbum = async (event) => {
    event.preventDefault()
    setServerMessage('')
    if (!newAlbum.title.trim() || !canCreate) return

    const result = await onCreateAlbum({
      ...newAlbum,
      createdAt: new Date().toISOString(),
      createdBy: session?.user?.username || session?.user?.email || "Toddlerfaces member",
      children: newAlbum.childId ? [newAlbum.childId] : [],
    });

    if (result?.album) {
      setAlbums((currentAlbums) => [result.album, ...currentAlbums]);
      setNewAlbum({
        title: '',
        childName: '',
        occasion: 'birthday',
        description: '',
        mediaProvider: 'google_drive',
        mediaSourceUrl: '',
        visibility: 'private',
        mood: 'warm',
        childId: '',
      });
      setServerMessage(result.album.publicApproval?.status === "pending_email"
        ? "Album created privately. Public sharing is pending the email approval workflow."
        : "Album created privately and ready for media references.");
      return;
    }

    setServerMessage(result?.response?.data?.message || "We could not create the album right now. Please sign in and try again.");
  };

  const handleDeleteAlbum = async (id) => {
    const result = await onDeleteAlbum(id);
    if (result?.message) {
      setAlbums((currentAlbums) => currentAlbums.filter((album) => album._id !== id));
    }
  }

  return (
    <div className="space-y-6">
      {albums.length === 0 ? (
        <EmptyAlbumPlaceholder canCreate={canCreate} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => (
            <AlbumTile album={album} onDeleteAlbum={handleDeleteAlbum} key={album._id} />
          ))}
        </div>
      )}

      <form onSubmit={handleCreateAlbum} className="overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <div className="border-b border-gray-200 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/80">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Create a memory album</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">Album, privacy, and source</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">{roleCopy}</p>
        </div>

        <fieldset disabled={!canCreate} className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              Album title
              <input className={fieldClass} value={newAlbum.title} onChange={(event) => setNewAlbum({ ...newAlbum, title: event.target.value })} placeholder="Third birthday morning" />
            </label>

            <label className={labelClass}>
              Child or album subject
              <input className={fieldClass} value={newAlbum.childName} onChange={(event) => setNewAlbum({ ...newAlbum, childName: event.target.value })} placeholder="Child or family name" />
            </label>
          </div>

          {children.length > 0 && (
            <label className={labelClass}>
              Link child profile
              <select className={fieldClass} value={newAlbum.childId} onChange={(event) => setNewAlbum({ ...newAlbum, childId: event.target.value, childName: children.find((child) => child._id === event.target.value)?.name || newAlbum.childName })}>
                <option value="">No linked profile</option>
                {children.map((child) => <option value={child._id} key={child._id}>{child.name}</option>)}
              </select>
            </label>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              Occasion
              <select className={fieldClass} value={newAlbum.occasion} onChange={(event) => setNewAlbum({ ...newAlbum, occasion: event.target.value })}>
                {occasionOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>

            <label className={labelClass}>
              Storage source
              <select className={fieldClass} value={newAlbum.mediaProvider} onChange={(event) => setNewAlbum({ ...newAlbum, mediaProvider: event.target.value })}>
                {providerOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
          </div>

          <label className={labelClass}>
            Source folder, gallery, or share link
            <input className={fieldClass} value={newAlbum.mediaSourceUrl} onChange={(event) => setNewAlbum({ ...newAlbum, mediaSourceUrl: event.target.value })} placeholder="Paste a Drive folder, gallery, or storage link" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              Visibility request
              <select className={fieldClass} value={newAlbum.visibility} onChange={(event) => setNewAlbum({ ...newAlbum, visibility: event.target.value })}>
                <option value="private">Private</option>
                <option value="shared">Shared by invite</option>
                <option value="public">Request public approval</option>
              </select>
            </label>

            <label className={labelClass}>
              Memory mood
              <select className={fieldClass} value={newAlbum.mood} onChange={(event) => setNewAlbum({ ...newAlbum, mood: event.target.value })}>
                <option value="warm">Warm birthday light</option>
                <option value="gentle">Soft family morning</option>
                <option value="studio">Clean studio delivery</option>
                <option value="bright">Bright celebration</option>
              </select>
            </label>
          </div>

          <label className={labelClass}>
            Memory note
            <textarea className={`${textareaClass} min-h-24`} value={newAlbum.description} onChange={(event) => setNewAlbum({ ...newAlbum, description: event.target.value })} placeholder="A short note about the day, the people, or the feeling this album should preserve." />
          </label>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-gray-200 p-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            Public requests remain private until moderation and account-holder email approval are complete. External media stays with the selected provider.
          </p>
          <button disabled={!canCreate} className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400" type="submit">
            Create album
          </button>
        </div>
        {serverMessage && <p className="border-t border-gray-200 px-5 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">{serverMessage}</p>}
      </form>
    </div>
  );
};

export default AlbumTiles;
