import { MyImage } from '../components'

const About = () => {
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
  


  return (
    <div className="center">
      <h2>About page</h2>

      <MyImage images={images} />
    </div>
  )
};

export default About;