/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React, { useState, useRef } from 'react'
import ImagePlayer from './image/image-player'

const normalizeImage = (image, index) => ({
  _id: image._id,
  url: image.url || image.sourceUrl || image.thumbnailUrl || image.path,
  fullUrl: image.sourceUrl || image.url || image.path,
  alt: image.alt || image.caption || `Memory ${index + 1}`,
  caption: image.caption || image.alt || "A quiet piece of the story.",
  width: image.width || 1200,
  height: image.height || 900,
  thumbnailWidth: image.thumbnailWidth || 600,
  thumbnailHeight: image.thumbnailHeight || 450,
  moderationStatus: image.moderationStatus,
  visibility: image.visibility,
})

const isRemote = (src = "") => /^https?:\/\//.test(src)

const MemoryImage = ({ image, className, priority = false }) => {
  if (isRemote(image.url)) {
    return <img src={image.url} alt={image.alt} className={className} loading={priority ? "eager" : "lazy"} />
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      width={image.thumbnailWidth}
      height={image.thumbnailHeight}
      className={className}
      priority={priority}
    />
  )
}

export default function MyImage({ images = [], onUpdateImage }) {
  const normalizedImages = images.map(normalizeImage).filter((image) => image.url)
  const [slideIndex, setSlideIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const slideshowInterval = useRef(null);
  const selectedImage = slideIndex !== null ? normalizedImages[slideIndex] : null

  const stopSlideshow = () => {
    setIsPlaying(false)
    clearInterval(slideshowInterval.current)
  }

  const handlePlayClick = () => {
    if (!normalizedImages.length) return

    if (isPlaying) {
      stopSlideshow()
    } else {
      setIsPlaying(true);
      slideshowInterval.current = setInterval(() => {
        setSlideIndex((prevIndex) => prevIndex === normalizedImages.length - 1 ? 0 : prevIndex + 1);
      }, 3500);
    }
  };

  const handlePrevClick = () => {
    stopSlideshow()
    setSlideIndex((slideIndex + normalizedImages.length - 1) % normalizedImages.length);
  };

  const handleNextClick = () => {
    stopSlideshow()
    setSlideIndex((slideIndex + 1) % normalizedImages.length);
  };

  const handleDownloadClick = () => {
    if (!selectedImage) return
    const link = document.createElement('a');
    link.href = selectedImage.fullUrl;
    link.setAttribute('download', selectedImage.alt);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  if (!normalizedImages.length) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-rose-300 to-amber-300" />
        <div className="mx-auto grid h-48 max-w-lg grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <div className={`rounded-md shadow-inner ${item % 4 === 0 ? "col-span-2 row-span-2 bg-rose-100 dark:bg-rose-950" : item % 3 === 0 ? "bg-amber-100 dark:bg-amber-950" : "bg-sky-100 dark:bg-sky-950"}`} key={item} />
          ))}
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-950 dark:text-white">This album is waiting for its first memory</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          Add external image references after attestation. They will appear here as a living gallery once metadata and moderation records exist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:grid-cols-4 lg:auto-rows-[190px]">
        {normalizedImages.map((image, index) => (
          <button
            className={`group relative overflow-hidden rounded-lg border bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-950 ${index % 7 === 0 ? "col-span-2 row-span-2" : ""} ${slideIndex === index ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-800'}`}
            key={`${image.url}-${index}`}
            onClick={() => {
              stopSlideshow()
              setSlideIndex(index);
            }}
            type="button"
          >
            <MemoryImage image={image} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" priority={index === 0} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
              <p className="line-clamp-2 text-sm font-medium">{image.caption}</p>
            {image.moderationStatus && (
                <p className="mt-1 text-xs capitalize text-white/75">{image.moderationStatus.replaceAll("_", " ")}</p>
              )}
            </div>
            {onUpdateImage && image._id && (
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                  {image.visibility?.replaceAll("_", " ") || "inherit"}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {onUpdateImage && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Image privacy controls</h3>
          <div className="mt-3 grid gap-2">
            {normalizedImages.filter((image) => image._id).map((image) => (
              <div className="flex flex-col gap-2 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between" key={image._id}>
                <span className="font-medium text-gray-800 dark:text-gray-100">{image.caption}</span>
                <select className="rounded-md border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950" value={image.visibility || "inherit_album"} onChange={(event) => onUpdateImage(image._id, { visibility: event.target.value })}>
                  <option value="inherit_album">Inherit album</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_38%)]" />
          <div className="relative max-h-[84vh] max-w-6xl">
            <MemoryImage image={selectedImage} className="max-h-[84vh] max-w-full rounded-lg object-contain shadow-2xl" priority />
            <div className="absolute inset-x-0 top-0 rounded-t-lg bg-gradient-to-b from-black/60 to-transparent p-5 text-white">
              <p className="max-w-2xl text-sm leading-6">{selectedImage.caption}</p>
            </div>
          </div>
          <div className="fixed bottom-6 z-20 flex items-center justify-center">
            <ImagePlayer
              onPlayPause={handlePlayClick}
              onPrev={handlePrevClick}
              onNext={handleNextClick}
              onDownload={handleDownloadClick}
              onClose={() => {
                stopSlideshow()
                setSlideIndex(null)
              }}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      )}
    </div>
  );
}
