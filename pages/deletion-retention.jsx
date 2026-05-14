import LegalPage from "../components/legal/LegalPage"

export default function DeletionRetention() {
  return (
    <LegalPage
      title="Deletion and Data Retention Policy"
      subtitle="Parents need clear controls for deletion, revocation, and external media responsibilities."
      sections={[
        { heading: "Deletion scope", body: "Users should be able to delete child profiles, albums, image metadata, and public links from Toddlerfaces." },
        { heading: "External storage", body: "Deleting metadata from Toddlerfaces may not delete original media from Google Drive, S3, Dropbox, OneDrive, or photographer-hosted galleries." },
        { heading: "Audit records", body: "Some upload attestation, public approval, moderation, abuse, and security records may need to be retained for legal, safety, and compliance purposes." },
      ]}
    />
  )
}
