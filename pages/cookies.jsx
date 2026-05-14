import LegalPage from "../components/legal/LegalPage"

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      subtitle="Toddlerfaces uses necessary cookies for account security and session continuity."
      sections={[
        { heading: "Strictly necessary cookies", body: "Authentication and session cookies are used to keep adult users signed in and protect private albums." },
        { heading: "Preference cookies", body: "Theme and UI preferences may be stored so dark and light mode behave consistently." },
        { heading: "Analytics and advertising", body: "Toddlerfaces does not use behavioral advertising cookies, third-party tracking pixels on child album pages, or analytics on public child album pages unless a privacy-preserving approach is added with clear notice." },
        { heading: "Third-party providers", body: "External storage, authentication, or embedded media providers may set their own cookies under their own policies." },
      ]}
    />
  )
}
