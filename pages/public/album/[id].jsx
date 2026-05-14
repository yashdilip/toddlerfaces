import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyImage from "../../../components/my-image";

export default function PublicAlbumPage() {
  const router = useRouter();
  const { id } = router.query;
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [albumResponse, imageResponse] = await Promise.all([
          axios.get(`/api/albums?id=${id}`),
          axios.get(`/api/images?albumId=${id}`),
        ]);
        setAlbum(albumResponse.data);
        setImages(Array.isArray(imageResponse.data) ? imageResponse.data.filter((image) => image.visibility !== "private") : []);
      } catch (error) {
        setMessage(error?.response?.data?.message || "This public album is unavailable.");
      }
    }

    load();
  }, [id]);

  if (message) {
    return (
      <div className="app-container app-page-centered">
        <div className="app-prose rounded-lg border border-gray-200 bg-white/90 p-6 text-sm text-gray-600 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90 dark:text-gray-300">
          {message}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container app-page">
      <section className="mb-8 rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Public memory album</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white">{album?.title || "Opening album"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          This album is public because parent/account-holder approval was recorded. Public links can be revoked by returning the album to private visibility.
        </p>
      </section>
      <MyImage images={images} />
    </div>
  )
}
