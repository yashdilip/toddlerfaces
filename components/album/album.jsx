import { useRouter } from "next/router";

const Album = () => {
  const router = useRouter();
  const { albumId } = router.query;
console.log({albumId})
  return (
    <div>
      <p>Album Detail page {albumId}</p>
    </div>
  )
}

export default Album;