import LegalPage from "../components/legal/LegalPage"

export default function PhotographerAgreement() {
  return (
    <LegalPage
      title="Photographer Upload Agreement"
      subtitle="Photographers must confirm authority, rights, and delivery permissions before attaching client media."
      sections={[
        { heading: "Permission to upload", body: "Photographers must confirm they have rights or client permission to upload or attach media references for parent clients." },
        { heading: "Children and other people", body: "Photographers must confirm they have required guardian permissions where applicable and permission to upload identifiable people appearing in the media." },
        { heading: "Storage responsibility", body: "Photographers may use external delivery galleries or storage providers. Toddlerfaces should store metadata and references, not become the long-term owner of original files." },
      ]}
    />
  )
}
