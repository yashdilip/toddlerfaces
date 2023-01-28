import Image from 'next/image';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import JSZip from 'jszip';
import { saveAs } from 'file-saver'
import { Url } from 'url'

export default function MyImage({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideshowInterval, setSlideshowInterval] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (isPlaying) {
      clearInterval(slideshowInterval);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setSlideshowInterval(setInterval(() => {
        setSlideIndex((slideIndex + 1) % images.length);
      }, 2000));
    }
  };

  const handlePrevClick = () => {
    clearInterval(slideshowInterval);
    setIsPlaying(false);
    setSlideIndex((slideIndex + images.length - 1) % images.length);
  };

  const handleNextClick = () => {
    clearInterval(slideshowInterval);
    setIsPlaying(false);
    setSlideIndex((slideIndex + 1) % images.length);
  };

  const handleDownloadClick = (image) => {
    console.log({ image })
    // Create a link element
    const link = document.createElement('a');
    link.href = image.url;
    link.setAttribute('download', image.name || image.alt);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const handleDownloadAllClick = (images) => {
    // Create a new JSZip instance
    const zip = new JSZip();
    // Add all images to the zip file
    (images || []).forEach((image) => {
      const myUrl = new Url(image.url);
      const ext = (myUrl.pathname || "").split(".").pop();
      const name = image.name || image.alt;

      zip.file(`${name}.${ext}`, image.url, { createFolders: false });
    });
    // Generate the zip file and trigger a download
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "images.zip");
    }, function (err) {
      console.error(err);
    });
  }


  useEffect(() => {
    if (slideIndex !== null) {
      setSelectedImage(images[slideIndex]);
    }
  }, [slideIndex, images]);

  return (
    <div className="flex flex-wrap">
      <button onClick={() => handleDownloadAllClick(images)}>Download All</button>

      {images.map((image, index) => (
        <div
          className={`w-1/3 p-2 ${slideIndex === index ? 'border-2 border-red-500' : ''}`}
          key={index}
          onClick={() => {
            setSlideIndex(index);
            clearInterval(slideshowInterval);
            setIsPlaying(false);
          }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            width={image.thumbnailWidth}
            height={image.thumbnailHeight}
            className="rounded-lg cursor-pointer"
          />
        </div>
      ))}
      {selectedImage && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-white p-4">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={selectedImage.width}
              height={selectedImage.height}
              className="rounded-lg"
            />
            <button onClick={() => handleDownloadClick(selectedImage)}>
              Download haha
          </button>
          </div>
          <div className="absolute left-0 w-full h-16 bg-white flex items-center justify-between px-4">
            <button className="text-gray-800" onClick={handlePrevClick}>
              Prev
            </button>
            <button className="text-gray-800" onClick={handleNextClick}>
              Next
            </button>
            <button className="text-gray-800" onClick={handlePlayClick}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button onClick={() => handleDownloadClick(selectedImage)}>
              Download
            </button>
            <button className="text-gray-800" onClick={() => setSelectedImage(null)}>
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}


export async function getServerSideProps() {
  // const { data } = await axios.get('http://example.com/images');
  // const images = data.images;

  const images = [
    {
      url: '/image1.jpg',
      alt: 'Image 1',
      thumbnailWidth: 200,
      thumbnailHeight: 150,
      width: 800,
      height: 600
    },
    {
      url: '/image2.jpg',
      alt: 'Image 2',
      thumbnailWidth: 150,
      thumbnailHeight: 200,
      width: 1000,
      height: 800
    },
    {
      url: '/image3.jpg',
      alt: 'Image 3',
      thumbnailWidth: 250,
      thumbnailHeight: 200,
      width: 1200,
      height: 1000
    },

    {
      url: '/image2.jpg',
      alt: 'Image 2',
      thumbnailWidth: 150,
      thumbnailHeight: 200,
      width: 1000,
      height: 800
    },
    {
      url: '/image1.jpg',
      alt: 'Image 1',
      thumbnailWidth: 200,
      thumbnailHeight: 150,
      width: 800,
      height: 600
    },
    {
      url: '/image3.jpg',
      alt: 'Image 3',
      thumbnailWidth: 250,
      thumbnailHeight: 200,
      width: 1200,
      height: 1000
    },
    {
      url: '/image1.jpg',
      alt: 'Image 1',
      thumbnailWidth: 200,
      thumbnailHeight: 150,
      width: 800,
      height: 600
    },
    {
      url: '/image2.jpg',
      alt: 'Image 2',
      thumbnailWidth: 150,
      thumbnailHeight: 200,
      width: 1000,
      height: 800
    },
    {
      url: '/image3.jpg',
      alt: 'Image 3',
      thumbnailWidth: 250,
      thumbnailHeight: 200,
      width: 1200,
      height: 1000
    },
    {
      url: '/image1.jpg',
      alt: 'Image 1',
      thumbnailWidth: 200,
      thumbnailHeight: 150,
      width: 800,
      height: 600
    },
    {
      url: '/image2.jpg',
      alt: 'Image 2',
      thumbnailWidth: 150,
      thumbnailHeight: 200,
      width: 1000,
      height: 800
    },
    {
      url: '/image3.jpg',
      alt: 'Image 3',
      thumbnailWidth: 250,
      thumbnailHeight: 200,
      width: 1200,
      height: 1000
    }
  ];

  return {
    props: {
      images,
    },
  };
}
