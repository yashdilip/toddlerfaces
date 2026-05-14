import LegalPage from "../components/legal/LegalPage"

export default function ChildPrivacy() {
  return (
    <LegalPage
      title="Child Privacy Notice"
      subtitle="Toddlerfaces handles metadata and references for children’s photos, so privacy and safety are treated as core product commitments."
      sections={[
        { heading: "Not child-directed", body: "Toddlerfaces is a parent-facing and photographer-facing service. Children may not create accounts, upload media, or directly provide data." },
        { heading: "Private albums", body: "Albums and images begin private. Parents choose when media is shared or public, and public visibility requires extra approval." },
        { heading: "Sensitive metadata", body: "Toddlerfaces avoids unnecessary sensitive image metadata where possible, especially EXIF geolocation, and does not use face recognition or biometric processing without a separate legal review and policy update." },
        { heading: "Deletion rights", body: "Parents can request deletion of child profiles, albums, image metadata, and public links. Deleting Toddlerfaces metadata may not delete originals from external storage providers." },
      ]}
    />
  )
}
