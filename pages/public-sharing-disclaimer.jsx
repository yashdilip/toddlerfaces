import LegalPage from "../components/legal/LegalPage"

export default function PublicSharingDisclaimer() {
  return (
    <LegalPage
      title="Public Sharing Disclaimer"
      subtitle="Public child albums carry extra privacy risk and must require deliberate approval."
      sections={[
        { heading: "Public means visible", body: "Public albums or images may be viewed by anyone with access to the public link." },
        { heading: "Approval workflow", body: "Public sharing should require an in-app request, a clear disclaimer, a pending approval record, a verified email approval link, moderation approval, and audit metadata before visibility changes." },
        { heading: "Reversal", body: "Parents should be able to revoke public links and return albums or images to private visibility." },
      ]}
    />
  )
}
