# Toddlerfaces

Toddlerfaces is a private-by-default child photo album app for adult parents, photographers, and admins. It helps families preserve birthdays, milestones, photographer sessions, and everyday memories without making the app the long-term owner of original child photos.

## What It Does

- Parent and photographer signup with adult eligibility attestation.
- Admin login after manually promoting a user in MongoDB; admin signup is blocked.
- Child profiles and child-linked albums.
- Album creation with occasion, memory mood, privacy, and external storage source.
- External media references from Google Drive, Dropbox, OneDrive, S3/R2, photographer galleries, or direct URLs.
- Google Drive Picker page for selecting multiple Drive images.
- Legal upload attestation before media can be attached.
- Private invites for shared album access.
- Parent-consent email approval before public album sharing, including photographer-created albums.
- Manual admin moderation queue that gates public approval.
- Audit logging for key legal, sharing, moderation, and album actions.
- Static legal/transparency pages for privacy, terms, child privacy, cookies, data collection, storage, public sharing, deletion, safety, content rights, and photographer agreements.

## Architecture

Toddlerfaces uses a metadata/media split:

- MongoDB stores account, role, child, album, image reference, permission, approval, moderation, email outbox, and audit metadata.
- Original media remains in user-controlled external storage.
- Local binary uploads are disabled in the production path.

## Tech Stack

- Next.js Pages Router
- React
- Tailwind CSS
- NextAuth.js
- MongoDB + Mongoose
- Formik + Yup
- Google Drive Picker client integration

## Getting Started

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

# Optional auth/storage integrations
GOOGLE_CLIENT_ID=optional-google-oauth-client-id
GOOGLE_CLIENT_SECRET=optional-google-oauth-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=optional-google-picker-client-id
NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY=optional-google-picker-api-key

# Optional email delivery
RESEND_API_KEY=optional-resend-api-key
SENDGRID_API_KEY=optional-sendgrid-api-key
EMAIL_DELIVERY_MODE=console
EMAIL_FROM="Toddlerfaces <noreply@example.com>"
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm test
npm run build
npm audit
```

## Docs

- [App source of truth](docs/APP_SOURCE_OF_TRUTH.md)
- [Production readiness checklist](docs/PRODUCTION_READINESS.md)
