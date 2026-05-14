import LegalPage from "../components/legal/LegalPage"

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="Toddlerfaces is designed to keep child album metadata transparent, controlled, and separate from original media storage."
      sections={[
        { heading: "Who the service is for", body: "Toddlerfaces is intended for adult parents, photographers, and admins. Children may not create accounts or directly provide personal information." },
        { heading: "What we collect", items: ["Account data such as name, email, password hash, role, birth month/year, adult attestation timestamp, and email verification status.", "Child, album, and media metadata such as child name, album title, visibility, provider references, captions, ordering, and public sharing status.", "Legal and audit data such as upload attestations, public approval requests, policy versions, IP address, user agent, timestamps, and moderation decisions."] },
        { heading: "Where media lives", body: "Original photos and videos remain in external storage providers such as Google Drive, S3, Dropbox, OneDrive, or photographer-hosted galleries. Toddlerfaces stores references and metadata, not long-term original media." },
        { heading: "How we use data", items: ["Authenticate users and enforce role-based access.", "Organize child albums and media references.", "Apply private, shared, and public visibility rules.", "Record required confirmations and approval workflows.", "Support moderation, safety, abuse reporting, and account protection."] },
      ]}
    />
  )
}
