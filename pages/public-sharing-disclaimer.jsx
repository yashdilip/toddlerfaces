import LegalPage from "../components/legal/LegalPage"

export default function PublicSharingDisclaimer() {
  return (
    <LegalPage
      title="Public Sharing Disclaimer"
      subtitle="Public child albums carry extra privacy risk, so publishing requires a deliberate approval flow."
      sections={[
        { heading: "Public means visible", body: "Public albums or images may be viewed by anyone with access to the public link." },
        { heading: "Approval workflow", body: "Public sharing requires an in-app request, a clear disclaimer, a pending approval record, a verified email approval link, moderation approval, and recorded metadata before visibility changes." },
        { heading: "Reversal", body: "Parents can revoke public links and return albums or images to private visibility." },
      ]}
    />
  )
}
