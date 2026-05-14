import LegalPage from "../components/legal/LegalPage"

export default function DataCollection() {
  return (
    <LegalPage
      title="Data Collection Notice"
      subtitle="This notice explains the categories of data Toddlerfaces is designed to collect and why."
      sections={[
        { heading: "Data categories", items: ["Account data", "Child metadata", "Album metadata", "Media provider references", "Legal and audit records", "Moderation results", "Authentication/session data", "Support and safety reports"] },
        { heading: "Why data is collected", items: ["Account authentication and adult eligibility", "Album organization and gallery rendering", "Public/private visibility enforcement", "Upload attestation and legal audit trail", "Public publishing approval", "Content moderation and child safety enforcement"] },
        { heading: "Storage transparency", body: "MongoDB is the metadata source of truth. Original media should remain in external storage providers selected by parents or photographers." },
      ]}
    />
  )
}
