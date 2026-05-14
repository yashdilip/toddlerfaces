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
    return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-gray-600 dark:text-gray-300">{message}</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Public memory album</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-950 dark:text-white">{album?.title || "Loading album..."}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          This album is public because parent/account-holder approval was recorded. Public links can be revoked by returning the album to private visibility.
        </p>
      </section>
      <MyImage images={images} />
    </div>
  )
}
