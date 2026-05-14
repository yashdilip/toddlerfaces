import LegalPage from "../components/legal/LegalPage";

export default function StorageStrategy() {
  return (
    <LegalPage
      title="Storage Strategy"
      subtitle="Toddlerfaces should not become the long-term owner of original child photos."
      sections={[
        { heading: "Default approach", body: "Toddlerfaces stores metadata in MongoDB and stores media as external references. Parents and photographers keep original photos in Google Drive, Dropbox, OneDrive, S3/R2, photographer galleries, or another provider they control." },
        { heading: "Why this matters", items: ["Keeps hosting cost low enough for a free app", "Reduces long-term storage and deletion responsibility", "Lets families keep ownership in tools they already use", "Makes provider permissions explicit instead of silently copying child media"] },
        { heading: "Google Drive plan", items: ["Phase 1: paste shared folder or file links and store provider metadata", "Phase 2: add Google OAuth and Drive Picker so a user can choose n images inside the app", "Phase 3: store Drive file IDs, thumbnails, captions, order, moderation status, and permission metadata without copying originals"] },
        { heading: "Production rule", body: "The local file upload endpoint is only a development fallback. Production should prefer external references or a user-provided bucket/provider, with every media action gated by attestation, moderation, and audit logging." },
      ]}
    />
  )
}
