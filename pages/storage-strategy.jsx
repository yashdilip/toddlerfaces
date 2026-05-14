import LegalPage from "../components/legal/LegalPage";

export default function StorageStrategy() {
  return (
    <LegalPage
      title="Storage Strategy"
      subtitle="Toddlerfaces organizes albums while families and photographers keep original photos in storage they control."
      sections={[
        { heading: "Default approach", body: "Toddlerfaces stores album details, permissions, approval history, captions, ordering, and image references. Parents and photographers keep original photos in Google Drive, Dropbox, OneDrive, S3/R2, photographer galleries, or another provider they control." },
        { heading: "Why this matters", items: ["Keeps the service sustainable without charging for large media storage", "Lets families keep originals in tools they already trust", "Makes provider permissions visible before child media is displayed", "Supports privacy and deletion choices without silently copying originals"] },
        { heading: "Google Drive", items: ["Use shared Drive links or the Drive Picker to select album images", "Store Drive file references, thumbnails, captions, order, review status, and permission records", "Display selected images without making Toddlerfaces the permanent photo vault"] },
        { heading: "Media references", body: "Toddlerfaces displays externally stored media through permissioned references. Upload and import actions require user confirmation and are recorded for safety, accountability, and support." },
      ]}
    />
  )
}
