import LegalPage from "../components/legal/LegalPage"

export default function ContentRights() {
  return (
    <LegalPage
      title="Copyright and Content Rights Policy"
      subtitle="Uploaders are responsible for confirming they have the right to upload, share, and manage media."
      sections={[
        { heading: "Rights confirmation", body: "Parents and photographers must confirm they own the media or have all necessary permissions before upload or attachment." },
        { heading: "Takedown process", body: "Toddlerfaces provides a monitored contact path for copyright, permission, or non-consensual sharing complaints." },
        { heading: "Restricted media", body: "Illegal, exploitative, abusive, unsafe, or non-consensual media may be removed, blocked, or reported." },
      ]}
    />
  )
}
