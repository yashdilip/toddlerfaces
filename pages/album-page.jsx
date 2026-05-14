export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/album",
      permanent: false,
    },
  }
}

export default function AlbumPageRedirect() {
  return null
}
