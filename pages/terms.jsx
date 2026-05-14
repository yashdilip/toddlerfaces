import LegalPage from "../components/legal/LegalPage"

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="These terms define adult account eligibility, uploader responsibility, public sharing controls, and safety enforcement."
      sections={[
        { heading: "Account eligibility", body: "Users must provide birth month and birth year and confirm they are at least 18 years old. Admin accounts cannot be created through public signup." },
        { heading: "Uploader responsibility", body: "By uploading or attaching media, users confirm they are authorized to use the account, own or have permission to upload the media, have required guardian permissions, and accept responsibility for the media they provide." },
        { heading: "Restricted content", body: "Users may not upload illegal, exploitative, abusive, non-consensual, unsafe, or restricted media. Toddlerfaces may scan, restrict, remove, or report media when required for safety, legal compliance, or policy enforcement." },
        { heading: "Public sharing", body: "Albums and images are private by default. Public sharing requires moderation approval and a separate email approval workflow before visibility changes." },
      ]}
    />
  )
}
