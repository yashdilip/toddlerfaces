import LegalPage from "../components/legal/LegalPage"

export default function ChildPrivacy() {
  return (
    <LegalPage
      title="Child Privacy Notice"
      subtitle="Toddlerfaces handles metadata and references for children’s photos, so privacy and safety are built into the product requirements."
      sections={[
        { heading: "Not child-directed", body: "Toddlerfaces is a parent-facing and photographer-facing service. Children may not create accounts, upload media, or directly provide data." },
        { heading: "Private by default", body: "Albums and images should begin private. Parents choose if media is shared or public, and public visibility requires extra approval." },
        { heading: "Sensitive metadata", body: "The app should strip or ignore sensitive image metadata where possible, especially EXIF geolocation, and avoid face recognition or biometric processing unless legally reviewed." },
        { heading: "Deletion rights", body: "Parents should be able to delete child profiles, albums, image metadata, and public links. Deleting Toddlerfaces metadata may not delete originals from external storage providers." },
      ]}
    />
  )
}
