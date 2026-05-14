import LegalPage from "../components/legal/LegalPage"

export default function Safety() {
  return (
    <LegalPage
      title="Safety and Abuse Reporting Policy"
      subtitle="Toddlerfaces requires layered safeguards beyond uploader attestation."
      sections={[
        { heading: "Required safeguards", items: ["Automated moderation before display or public sharing", "Admin review for flagged or uncertain media", "Private-by-default albums and images", "Separate email approval before public publishing", "Upload and public publishing audit logs", "Fast takedown and public-link revocation"] },
        { heading: "Moderation categories", body: "Uploaded media may be screened for nudity, sexual content, violence, gore, abuse, self-harm, hate, or other restricted content." },
        { heading: "Reports", body: "Suspected child sexual exploitation or abuse material must follow the safety reporting process and may be reported to appropriate authorities or reporting systems." },
      ]}
    />
  )
}
