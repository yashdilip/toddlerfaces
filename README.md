# Toddlerfaces

Toddlerfaces is a child-focused photo album app for adult parents, photographers, and admins. The product goal is not just to store and display photos. The app should help families preserve birthdays, milestones, photographer sessions, and everyday memories in a private-by-default gallery that feels beautiful years later.

## Product Direction

- Parents create child albums for birthdays, milestones, family collections, and memories.
- Photographers create or deliver albums for parent clients.
- Admins manage users, safety, moderation, and operational review after being promoted directly in MongoDB.
- Public signup allows only `parent` and `photographer`.
- Admin signup is intentionally blocked in UI and API.
- Albums and images are private by default.
- Public sharing requires a deliberate approval flow, including email confirmation and audit metadata.
- Every media upload or external media attachment requires legally binding attestation.

## Storage Strategy

Toddlerfaces uses a metadata/media split:

- MongoDB stores users, roles, albums, child/album metadata, image references, permissions, legal attestations, moderation statuses, and audit records.
- Original media should live outside the app in parent or photographer controlled storage.
- Supported product direction: Google Drive, Dropbox, OneDrive, S3/R2, photographer galleries, or direct external URLs.
- The app should avoid becoming the long-term storage owner for original child photos.
- The old local upload endpoint is now disabled for production behavior; use external media references instead.

Google Drive path:

1. Phase 1: accept Drive folder/file links and store provider metadata.
2. Phase 2: use Google OAuth and Drive Picker so users can select `n` images from their Drive.
3. Phase 3: store Drive file IDs, thumbnail links, captions, ordering, moderation state, and permissions without copying originals.

## Implemented

- Production-styled shared shell with responsive header, footer, logo, legal links, and dark/light theme support.
- Polished landing page with visual memory-focused layout.
- Role-based signup for parent and photographer.
- Admin signup blocked in UI and API.
- Credentials login supports parent, photographer, and admin users.
- User model includes role, birth month/year, adult attestation timestamp, and legal acceptance timestamp.
- Signup requires adult eligibility data and legal acceptance.
- Album model includes title, child name, occasion, description, visibility, external storage provider, source URL, public approval state, mood, and legal audit entries.
- Image model includes external URL, thumbnail URL, provider, caption, visibility, moderation status, download flag, and upload attestation metadata.
- Album API attaches created albums to the signed-in user and filters albums by role/ownership.
- Album create flow supports external storage source, visibility request, occasion, child/subject, and memory mood.
- Public visibility requests are forced into pending approval instead of immediately publishing.
- Photographer public sharing requires parent consent email approval before the album can become public.
- Email verification tokens are generated on signup and queued through the MongoDB email outbox.
- Public approval emails, album invites, and verification emails are queued in `EmailOutbox`.
- Admins can process the email outbox through Resend, SendGrid, or console delivery mode.
- Google OAuth scope and native Drive Picker page are implemented for selecting `n` Drive images.
- Child profile model and child-to-album linking are implemented.
- Dedicated role dashboard exists for parent, photographer, and admin workflows.
- Invite-based private album sharing is implemented with accept links.
- Public album pages exist for approved albums, with revocation through album visibility updates.
- Image-level visibility controls are available in the album gallery.
- Audit logs are written to a dedicated collection for child, album, media, invite, and public approval actions.
- Phase-one Google Drive support accepts selected Drive/file links in bulk so users can import `n` selected images as external references.
- Admin moderation queue is implemented as a manual review gate while automated moderation provider integration remains future work.
- Public approval cannot complete until all album images are marked moderation-approved.
- Album gallery page supports external media reference attachment with required attestation.
- Image references are stored as metadata records and marked pending moderation.
- Gallery UI has a richer mosaic layout, captions, full-screen viewer, slideshow controls, and polished empty states.
- Static legal/transparency pages exist:
  - Privacy
  - Terms
  - Child Privacy
  - Cookies
  - Data Collection
  - Storage Strategy
  - Public Sharing Disclaimer
  - Photographer Agreement
  - Content Rights
  - Deletion and Retention
  - Safety
- API routes were hardened for Mongo connection failures and several older controller/model bugs were fixed.
- Smoke tests cover role signup constraints, storage posture, public approval consent, email delivery hooks, moderation gates, Drive Picker integration, and model requirements.

## Not Yet Implemented

These are the main remaining production gaps:

- Automated content moderation provider integration.
- Deeper automated tests for auth sessions, role permissions, album CRUD, and media reference workflows.
- Production attorney-reviewed legal copy.

## Legal And Safety Requirements

Toddlerfaces handles child-related images and metadata, so production must treat safety and privacy as core system behavior.

Required principles:

- Adult accounts only.
- Children must not create accounts.
- Birth month and birth year are collected for adult eligibility attestation.
- Albums and images start private.
- Parents control public/private choices.
- Photographers must attest they have client/guardian permission.
- Every media action requires attestation.
- Attestation alone is not enough; moderation and admin review are also needed.
- Public sharing must require email approval and audit logging.
- The app must clearly disclose collected data and cookie behavior.
- The app should not sell children's data or use behavioral advertising on child album pages.
- The app should avoid biometric identification and face recognition unless reviewed legally first.

Recommended moderation providers:

- Google Cloud Vision SafeSearch
- Amazon Rekognition DetectModerationLabels
- Azure AI Content Safety
- OpenAI Moderation API for supported image/text moderation workflows

## Current Stack

- Next.js 16 Pages Router
- React 19
- Tailwind CSS 4
- NextAuth.js credentials auth
- MongoDB and Mongoose
- Axios service helpers
- Formik and Yup for auth forms

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
MONGODB_URI=your-mongodb-uri
NEXTAUTH_URL=http://localhost:3000
SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret
GITHUB_ID=optional-github-client-id
GITHUB_SECRET=optional-github-client-secret
GOOGLE_CLIENT_ID=optional-google-oauth-client-id
GOOGLE_CLIENT_SECRET=optional-google-oauth-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=optional-google-picker-client-id
NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY=optional-google-picker-api-key
RESEND_API_KEY=optional-resend-api-key
SENDGRID_API_KEY=optional-sendgrid-api-key
EMAIL_DELIVERY_MODE=console
EMAIL_FROM="Toddlerfaces <noreply@example.com>"
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.
