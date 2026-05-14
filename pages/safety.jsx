import LegalPage from "../components/legal/LegalPage"

export default function Safety() {
  return (
    <LegalPage
      title="Safety and Abuse Reporting Policy"
      subtitle="Toddlerfaces uses layered safeguards because child photos deserve more than a simple upload button."
      sections={[
        { heading: "Required safeguards", items: ["Automated moderation before display or public sharing", "Admin review for flagged or uncertain media", "Private albums and images unless sharing is requested", "Separate email approval before public publishing", "Recorded upload and public publishing history", "Fast takedown and public-link revocation"] },
        { heading: "Moderation categories", body: "Uploaded media may be screened for nudity, sexual content, violence, gore, abuse, self-harm, hate, or other restricted content." },
        { heading: "Reports", body: "Suspected child sexual exploitation or abuse material must follow the safety reporting process and may be reported to appropriate authorities or reporting systems." },
      ]}
    />
  )
}
