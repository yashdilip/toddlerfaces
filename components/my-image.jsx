import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip';
import { saveAs } from 'file-saver'
import ImagePlayer from './image/image-player'

export default function MyImage({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [slideIndex, setSlideIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * positioning image
   */

  let scrollOffset = 0;
  if (typeof window !== 'undefined') {
    const navHeight = document.querySelector('nav').offsetHeight
    scrollOffset = navHeight
  }
  
  const slideshowInterval = useRef(null);

  const handlePlayClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(slideshowInterval.current);
    } else {
      setIsPlaying(true);
      slideshowInterval.current  = setInterval(() => {
        setSlideIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    if (slideIndex !== null) {
      setSelectedImage(images[slideIndex]);
    }
  }, [slideIndex, images]);

  const overlayRef = useRef();

  const handleOnClose = (event) => {
    setSelectedImage(null);
    setIsPlaying(false);
    clearInterval(slideshowInterval.current);
  };

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
            handleImageClick(image);
          }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            width={image.thumbnailWidth}
            height={image.thumbnailHeight}
            className="rounded-lg object-cover cursor-pointer"
          />
        </div>
      ))}
      {selectedImage && (
        <div ref={overlayRef} className="fixed left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-10" style={{top: `${scrollOffset}px`}}>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={selectedImage.width}
              height={selectedImage.height}
              className="max-w-full max-h-full object-contain"
            />
            <div className="fixed bottom-4 z-20 flex items-center justify-center">
              <ImagePlayer 
                onPlayPause={handlePlayClick}
                onPrev={handlePrevClick}
                onNext={handleNextClick}
                onDownload={handleDownloadClick}
                onClose={handleOnClose}
                isPlaying={isPlaying}
              />
            </div>
          </div>
        </div>
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
