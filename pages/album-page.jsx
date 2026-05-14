import { useRef } from 'react'
import { MyImage } from '../components'

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

const AlbumPage = ({albumId}) => {
  const contentRef = useRef(null)
  const imageRef = useRef(null);


  // to-do get all album/images by albumId api call and render the page

  const handleScrollClick = () => {
    const navHeight = document.querySelector('nav').offsetHeight
    const contentTop = contentRef.current.getBoundingClientRect().top
    const imageHeight = imageRef.current.offsetHeight
    const windowHeight = window.innerHeight
    const scrollOffset = contentTop - windowHeight - navHeight + imageHeight
    window.scrollBy({ top: scrollOffset, left: 0, behavior: 'smooth' })
  }

  
  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center">
        <div
          ref={imageRef}
          className="bg-cover bg-center w-full h-screen"
          style={{
            backgroundImage:
              'url(/pexels-cottonbro-studio-8072281.jpg)',
            backgroundSize: 'cover'
          }}
        ></div>
        <div className="absolute bottom-0">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleScrollClick}
          >
            View Images
          </button>
        </div>
      </div>
      <div ref={contentRef}>
        <MyImage images={images} />
      </div>
    </>
  )
}

export default AlbumPage
