# Toddlerfaces

Toddlerfaces is a photo album app for parents and photographers. The product direction is to let a parent create child-focused albums, such as birthday albums, school events, milestones, or photo sets shared by a photographer, then organize and preview those images in a polished gallery experience.

The core architecture is intentionally split: MongoDB is the source of truth for metadata, while media files live in a separate storage provider. Toddlerfaces should store users, roles, children, albums, image references, permissions, captions, ordering, and provider metadata in MongoDB. The actual photos and videos should live outside the app in places like Google Drive, S3, Dropbox, OneDrive, photographer-hosted galleries, or another media storage provider.

## Product Goal

Parents should be able to:

- Sign up and log in.
- Create one or more child albums.
- Add images to an album from an external storage source.
- Preview albums as a clean photo gallery.
- Open an album, browse images, view a larger preview, run a slideshow, and download selected images when allowed.
- Make albums and individual images public or private.
- Update or delete albums they own.

Photographers should be able to:

- Sign up and log in.
- Create or share albums for parent clients.
- Attach externally hosted images to albums without requiring Toddlerfaces to pay for image storage.

Admins should be able to:

- Manage users, roles, albums, and abuse/safety concerns.
- Support moderation and operational workflows.

## Privacy And Legal Posture

Toddlerfaces handles photos and metadata related to children, so privacy and safety must be designed into the product from the beginning. The app should be positioned as a parent-facing and photographer-facing service, not a child-facing service.

Core legal/privacy assumptions:

- Accounts are for adults only: parents, photographers, and admins.
- Account creation must ask for the user's birth month and birth year so the user can attest they are an adult before creating an account.
- Children should not be allowed to create accounts, upload media, or directly provide personal information.
- Albums and images should be private by default.
- Parents must explicitly choose when an album or image becomes public.
- Public visibility must require a multi-step approval flow before an album or image becomes public.
- Public sharing should be reversible through link revocation or visibility changes.
- Every image/media upload by a parent or photographer must require explicit legal attestation before the upload is accepted.
- Every upload attestation must be recorded in the database for audit and compliance purposes.
- Uploaded or externally attached media should be screened by a content moderation provider before it is approved for gallery display or public sharing.
- MongoDB stores metadata only; original media files should live in external storage providers.
- The app should avoid behavioral advertising, selling data, or monetizing children's data.
- The app should avoid face recognition, biometric templates, automatic face tagging, or similar biometric processing unless reviewed legally first.
- The app should support deletion of child profiles, albums, image metadata, and public links.
- The app should strip or ignore sensitive image metadata where possible, especially EXIF geolocation.
- Private album access must be enforced on the server, not only hidden in the UI.
- The app should keep a clear escalation path for abuse, illegal content, and child safety reports.

## Required Legal And Disclaimer Pages

Before production launch, Toddlerfaces should include clear legal/disclaimer pages written in plain language. These pages should be reviewed by a qualified attorney before public release.

Required pages:

- Privacy Policy
- Terms of Service
- Child Privacy Notice
- Public Sharing Disclaimer
- Photographer Upload Agreement
- Copyright/DMCA or Content Rights Policy
- Deletion and Data Retention Policy
- Safety and Abuse Reporting Policy
- Cookie Policy
- Data Collection Notice

These pages must explicitly mention:

- Toddlerfaces is intended for adult users, not children.
- Users must provide birth month and birth year during account creation to support adult-only account eligibility.
- Parents and photographers are responsible for confirming they have permission to upload and share photos.
- Parents and photographers must accept legally binding upload attestation language each time they upload or attach media.
- Upload attestation records must be stored with timestamps, user, album, source provider, policy versions, IP address, and user agent.
- Parents control whether albums and images are private, shared, or public.
- Public albums/images may be viewed by anyone with access to the public link.
- Making an album or image public requires an additional approval step through the account holder's verified email.
- Public links can increase privacy risk for children and should be used carefully.
- The app stores metadata in MongoDB and media in separate external storage providers such as Google Drive, S3, Dropbox, OneDrive, or photographer-hosted galleries.
- The app must clearly disclose what data is collected, why it is collected, where it is stored, how long it is retained, and which third parties may process it.
- The Cookie Policy must clearly disclose authentication cookies, session cookies, preference cookies, analytics cookies if any, and third-party cookies if any.
- External storage providers have their own terms, privacy policies, permissions, and retention behavior.
- Deleting metadata from Toddlerfaces may not automatically delete original media from the external storage provider.
- Users should not upload illegal, exploitative, abusive, or non-consensual content.
- Uploaded media may be automatically screened for nudity, sexual content, violence, gore, abuse, or other restricted content.
- Suspected child sexual exploitation or abuse material may be reported to the appropriate authorities or reporting systems.
- The app does not currently perform biometric identification or face recognition.
- The app should not sell children's data or use it for behavioral advertising.

## Public Publishing Workflow

Albums and images must never become public from a single click. Public publishing should require a deliberate approval workflow.

Required flow:

1. Parent chooses to make an album or image public.
2. App shows a clear public sharing disclaimer explaining that child photos may become viewable by anyone with the public link.
3. Parent confirms the request in the app.
4. App creates a pending public approval request.
5. App sends an approval email to the verified account holder email address.
6. Parent opens the email and approves through a time-limited secure link.
7. App verifies the approval token, account holder, request status, and expiration.
8. App captures legal/audit metadata.
9. App changes the album or image visibility to public.
10. App records the final public URL, approval timestamp, and policy/disclaimer versions shown at the time of approval.

Audit metadata to capture:

- User ID
- Account holder email
- Target type: album or image
- Target ID
- Previous visibility
- Requested visibility
- Approval status
- Approval request timestamp
- Approval email sent timestamp
- Approval timestamp
- IP address
- User agent
- Legal notice version
- Privacy policy version
- Public sharing disclaimer version
- Public URL or slug

## Upload Attestation Workflow

Every time a parent or photographer uploads media or attaches external media references, the app must require a legal attestation before accepting the action.

Uploader attestation is necessary, but it is not enough by itself. Toddlerfaces should treat attestation as one layer in a broader safety and compliance system.

Required flow:

1. User selects images, videos, or external media references to add to an album.
2. App shows legally binding upload attestation language.
3. User must actively confirm the attestation before upload/import continues.
4. App records the attestation in MongoDB.
5. App screens the uploaded media or external media reference through a content moderation provider where technically possible.
6. App stores media metadata, moderation status, and external storage references.
7. App rejects the upload/import if attestation is missing.
8. App blocks, quarantines, or routes flagged media to admin review depending on moderation severity.

Upload attestation language should require the user to confirm:

- They are an adult and authorized to use the account.
- They own the media or have permission to upload it.
- They have permission from the child's parent/legal guardian where required.
- They have permission to upload media that includes other children or identifiable people.
- The media is not illegal, exploitative, abusive, non-consensual, or unsafe.
- They understand media may remain stored in the external provider even if Toddlerfaces metadata is deleted.
- They understand public sharing requires a separate approval workflow.

Suggested upload attestation wording:

> By uploading or attaching media, you confirm that you are an adult authorized to use this account, that you have all necessary rights and permissions to upload and share this media, that you have any required permission from a child's parent or legal guardian, that the media does not contain illegal, exploitative, abusive, non-consensual, or restricted content, and that you accept responsibility for the media you provide. Toddlerfaces may scan, restrict, remove, or report media when required for safety, legal compliance, or policy enforcement.

Audit metadata to capture:

- User ID
- User role
- Account holder email
- Album ID
- Child ID when applicable
- Uploaded image IDs or external media reference IDs
- Source provider
- Source URL or storage key
- Attestation text version
- Terms of Service version
- Privacy Policy version
- Child Privacy Notice version
- Timestamp
- IP address
- User agent
- Upload/import status
- Moderation provider
- Moderation status
- Moderation labels/categories
- Moderation confidence scores

Required safeguards beyond attestation:

- Automated content moderation before gallery display or public sharing.
- Admin review for flagged, uncertain, or high-risk images.
- Private-by-default album and image visibility.
- Separate email approval before making an album or image public.
- Upload and public publishing audit logs.
- Clear Terms of Service, Privacy Policy, Child Privacy Notice, Cookie Policy, Data Collection Notice, and Public Sharing Disclaimer.
- Abuse and safety reporting flow.
- Fast takedown, deletion, and public-link revocation process.
- Server-side access controls for private albums and images.
- No behavioral advertising or sale of children's data.
- Safety reporting process for suspected illegal child exploitation or abuse material.

## Content Moderation

Toddlerfaces should use an image moderation provider to help detect nudity, sexual content, violence, gore, self-harm, hate symbols, or other restricted content before media appears in galleries or becomes public.

Candidate providers:

- Google Cloud Vision SafeSearch: detects categories such as adult, spoof, medical, violence, and racy.
- Amazon Rekognition DetectModerationLabels: detects unsafe content in images and videos, including explicit nudity, violence, weapons, drugs, alcohol, tobacco, hate symbols, gambling, and rude gestures.
- Azure AI Content Safety: analyzes images for sexual content, violence, hate, and self-harm severity levels.
- OpenAI Moderation API: can classify text and image inputs for potentially harmful categories.

Recommended moderation flow:

1. User completes upload attestation.
2. App uploads media to the external provider or receives an external media reference.
3. App calls the moderation provider using image bytes, a signed temporary URL, or provider-supported storage reference.
4. App stores moderation results in MongoDB.
5. App marks media as one of:
   - `approved`
   - `needs_review`
   - `blocked`
   - `failed_scan`
6. App prevents public sharing until moderation status is `approved`.
7. App routes uncertain or high-risk results to admin review.

Important implementation rules:

- Automated moderation should not be treated as perfect.
- Public sharing should require both moderation approval and the separate public publishing email approval workflow.
- Private gallery display may still require moderation approval depending on risk tolerance.
- Moderation metadata should be retained for audit purposes.
- Admins should be able to review, override, or permanently block flagged media.
- Flagged or suspected illegal child exploitation material must follow the safety reporting process.

## Data Collection Transparency

Toddlerfaces should maintain a clear, user-readable Data Collection Notice and Cookie Policy. These should be linked from signup, login, upload, public publishing, footer, and account settings.

The Data Collection Notice should explain each category of collected data:

- Account data: name, email, password hash, role, birth month, birth year, adult attestation timestamp, email verification timestamp.
- Child metadata: child name, optional birth date, linked parent account, linked albums, optional avatar reference.
- Album metadata: title, description, album type, child links, owner, photographer, visibility, sharing settings, public slug, timestamps.
- Media metadata: external provider, external file ID, source URL, thumbnail URL, storage bucket/key where applicable, caption, order, visibility, download settings.
- Legal/audit data: upload attestations, public approval requests, policy versions, timestamps, IP address, user agent, approval status, upload status.
- Moderation data: moderation provider, labels, scores, review status, admin decisions, and timestamps.
- Authentication/session data: cookies or tokens required to keep users signed in and protect accounts.
- Preference data: theme, UI settings, or other non-sensitive app preferences.
- Support/safety data: reports, moderation notes, abuse reports, and admin action logs where applicable.

The Data Collection Notice should explain why data is collected:

- Account creation and authentication.
- Adult-only account eligibility.
- Album and child profile organization.
- External media display and gallery rendering.
- Public/private visibility enforcement.
- Upload permission attestation and legal audit trail.
- Public publishing approval and audit trail.
- Abuse prevention, support, and safety reporting.
- Content moderation and child safety enforcement.
- Security monitoring and account protection.

The Cookie Policy should explain:

- Which cookies are required for authentication and session management.
- Which cookies are used for preferences such as theme.
- Whether analytics cookies are used.
- Whether third-party cookies are used by providers such as auth, analytics, storage, or embedded media providers.
- How users can control cookies in their browser.
- Which cookies are strictly necessary versus optional.

Default product stance:

- Use only strictly necessary cookies unless optional analytics are intentionally added later.
- Do not use behavioral advertising cookies.
- Do not use third-party tracking pixels on child album pages.
- Avoid analytics on public child album pages unless privacy-preserving analytics are explicitly approved.

## Current Stack

- Next.js 13 pages router
- React 18
- Tailwind CSS and Sass
- NextAuth.js for authentication
- MongoDB and Mongoose for persistence
- Axios service helpers
- Formik and Yup for auth forms
- React Dropzone and Multer experiments for upload flows
- JSZip and FileSaver experiments for downloading images

## Implemented Today

These features exist in the current codebase, although some are still prototype quality.

- App shell with shared header, footer, logo, navigation, dark mode toggle, and mobile menu.
- Auth page with sign-in/sign-up form toggle.
- Credentials signup endpoint that hashes passwords with bcrypt.
- NextAuth credentials provider wired to MongoDB users.
- GitHub provider configuration stub through NextAuth.
- MongoDB connection helper with development connection reuse.
- User model with `username`, `email`, `password`, and `createdAt`.
- Album model with `title`, `owner`, `sharedWith`, `images`, `createdBy`, and `createdAt`.
- Image model concept with album relationship and image path.
- Album API handlers for create, read, update, and delete.
- User API handlers for create, read, update, and delete.
- Client-side album service helpers for fetching, creating, updating, and deleting albums.
- Album tile grid on the home route.
- Album creation form.
- Album tile edit and delete controls.
- Album detail route prototype at `/album?albumId=...`.
- Dropzone-based image upload prototype that posts files to `/api/images/upload`.
- Multer upload endpoint that writes uploaded files under `public/images/`.
- Static image gallery prototype through `MyImage`.
- Full-screen image preview overlay.
- Previous, next, play/pause slideshow, close, and download controls in the gallery prototype.
- Download-all ZIP experiment.
- Static album/gallery demo page at `/album-page`.
- Basic About and Contact pages.

## Partially Implemented Or Needs Repair

These pieces exist but should not be considered production-ready yet.

- Auth does not yet model roles. Users are not separated into `parent`, `photographer`, and `admin`.
- Route protection and middleware are not implemented. Private album pages can be reached without a complete authorization layer.
- Album ownership is defined in the schema but the current album create UI does not reliably attach the signed-in user as owner.
- Album sharing exists as a service function concept, but it is not exposed through a complete API/UI flow.
- Image upload currently stores files locally in `public/images/`, which conflicts with the free-hosting storage objective.
- Image metadata is not consistently connected to albums after upload.
- `models/Image.js` exports `model('Image', userSchema)` instead of `imageSchema`; this must be fixed before using the image model.
- Image API routing is incomplete and currently imports user function names from `./images`.
- Several API handlers reference `response` where `res` is expected.
- Some handlers use `req.params`, which is not how the current Next.js API routes are structured.
- User API update has variable shadowing and references `user` before it exists.
- Gallery data is currently static demo data rather than album-specific database data.
- Download-all ZIP logic needs to fetch actual image blobs and has a `Url` typo that should be `URL`.
- Album UI currently uses generic fields like `createdBy` and `createdAt`; it does not yet model child name, event name, birthday year, photographer, source provider, or permissions.
- No automated tests are present.
- No complete environment example exists yet.

## Not Implemented Yet

These are core product features still needed for the shifted objective.

- Role-based auth for `parent`, `photographer`, and `admin`.
- Middleware and server-side authorization checks.
- Parent dashboard showing their children and albums.
- Photographer dashboard showing client albums and delivery status.
- Admin dashboard.
- Child profile model.
- Album types such as birthday, event, milestone, photographer delivery, family collection, or custom.
- External storage provider integration.
- Google Drive link ingestion.
- Selecting `n` images from an external source.
- Storing external image metadata without copying original files into Toddlerfaces storage.
- Album cover selection.
- Album privacy controls.
- Image-level privacy controls.
- Share links and invite-based access.
- Image selection, ordering, captions, favorites, tags, and notes.
- Bulk add/remove images.
- Album-level download permissions.
- Image moderation or report flow.
- Legal/disclaimer pages for privacy, terms, child privacy, public sharing, deletion, and safety reporting.
- Upload attestation workflow and upload audit records.
- Content moderation provider integration for uploaded or externally attached media.
- Cookie Policy and Data Collection Notice for transparent disclosure of collected data.
- Production-ready responsive gallery UI.
- Loading, empty, error, and permission-denied states.
- Deployment documentation.

## Core Storage Architecture

Toddlerfaces should use a metadata/media split.

- MongoDB stores metadata.
- External storage stores media.
- The app connects the two through durable references such as provider name, external file ID, source URL, thumbnail URL, access scope, and album/image relationships.

This keeps the app cheaper to host, easier to deploy, and less responsible for long-term media storage. It also lets parents and photographers keep ownership of their photos in the storage system they already use.

## Recommended Storage Direction

Because the goal is to host this as a free or low-cost app, Toddlerfaces should avoid becoming the system of record for original image files. MongoDB should be the system of record for application data and media metadata, not the binary media itself.

Recommended approach:

1. Store metadata in MongoDB:
   - Album records
   - Child records
   - User records
   - Role and permission records
   - External image references
   - Thumbnail URLs when available
   - Provider and access metadata
   - Captions, ordering, favorites, and display settings

2. Store media files in a separate provider:
   - Google Drive
   - Google Photos export/shared album links
   - Dropbox
   - OneDrive
   - S3 or S3-compatible object storage
   - iCloud shared links where technically feasible
   - Photographer-hosted delivery galleries
   - Any public or signed URL provider

3. For Google Drive specifically:
   - Start simple with shared folder links or manually pasted file links.
   - Later add OAuth so users can browse Drive folders and select images inside the app.
   - Store Drive file IDs and thumbnail links instead of copying files.

4. Avoid local `public/images/` upload as a production storage plan:
   - It does not persist reliably on serverless deployments.
   - It increases hosting cost and storage responsibility.
   - It creates privacy and cleanup problems.

## Suggested Data Model Direction

The current models are a good starting point, but the product likely needs clearer domain objects.

### User

- `name`
- `email`
- `passwordHash`
- `role`: `parent`, `photographer`, or `admin`
- `birthMonth`
- `birthYear`
- `adultAttestedAt`
- `emailVerifiedAt`
- `createdAt`
- `updatedAt`

### Child

- `parentId`
- `name`
- `birthDate`
- `avatarImageRef`
- `createdAt`
- `updatedAt`

### Album

- `title`
- `description`
- `type`
- `ownerId`
- `childIds`
- `photographerId`
- `coverImageId`
- `visibility`: `private`, `shared`, or `public`
- `publicSlug`
- `allowPublicDownload`
- `publicApprovedAt`
- `publicApprovedBy`
- `publicApprovalRequestId`
- `sourceProvider`: `google_drive`, `dropbox`, `onedrive`, `external_url`, or `local_dev`
- `sourceUrl`
- `sharedWith`
- `createdAt`
- `updatedAt`

### Image

- `albumId`
- `provider`
- `externalId`
- `sourceUrl`
- `thumbnailUrl`
- `storageBucket`
- `storageKey`
- `visibility`: `private`, `inherit_album`, or `public`
- `allowPublicDownload`
- `publicApprovedAt`
- `publicApprovedBy`
- `publicApprovalRequestId`
- `moderationStatus`
- `moderationProvider`
- `moderationLabels`
- `moderationReviewedAt`
- `moderationReviewedBy`
- `width`
- `height`
- `caption`
- `sortOrder`
- `createdAt`
- `updatedAt`

### Upload Attestation

- `userId`
- `userRole`
- `accountHolderEmail`
- `albumId`
- `childIds`
- `mediaIds`
- `sourceProvider`
- `sourceUrl`
- `storageBucket`
- `storageKey`
- `attestationTextVersion`
- `termsVersion`
- `privacyPolicyVersion`
- `childPrivacyNoticeVersion`
- `acceptedAt`
- `ipAddress`
- `userAgent`
- `status`: `accepted`, `rejected`, or `revoked`
- `moderationProvider`
- `moderationStatus`
- `createdAt`
- `updatedAt`

### Media Moderation Result

- `mediaId`
- `albumId`
- `childIds`
- `provider`
- `status`: `approved`, `needs_review`, `blocked`, or `failed_scan`
- `labels`
- `scores`
- `rawResultRef`
- `reviewedBy`
- `reviewedAt`
- `adminDecision`
- `createdAt`
- `updatedAt`

### Public Approval Request

- `targetType`: `album` or `image`
- `targetId`
- `requestedBy`
- `accountHolderEmail`
- `status`: `pending`, `approved`, `expired`, `cancelled`, or `rejected`
- `requestedVisibility`
- `previousVisibility`
- `approvalTokenHash`
- `approvalEmailSentAt`
- `approvedAt`
- `expiresAt`
- `ipAddress`
- `userAgent`
- `legalNoticeVersion`
- `privacyPolicyVersion`
- `publicSharingDisclaimerVersion`
- `createdAt`
- `updatedAt`

## Suggested Roadmap

### Phase 1: Stabilize Current App

- Fix broken image model export.
- Fix image API routing.
- Fix user API bugs.
- Add `.env.example`.
- Ensure signup, login, album CRUD, and album detail loading work end to end.
- Attach albums to the authenticated owner.
- Add adult account eligibility fields: birth month, birth year, and adult attestation timestamp.
- Add upload attestation records before accepting parent or photographer media uploads/imports.
- Add media moderation result records and block public sharing until moderation passes.
- Replace local upload as the default production path.

### Phase 2: Product Shape

- Add roles: parent, photographer, admin.
- Add middleware and server-side authorization.
- Add child profiles.
- Redesign album creation around child, event, album type, and source link.
- Add album-level and image-level public/private controls.
- Add multi-step public approval flow with email verification and audit logging.
- Add legally binding upload attestation UI and persistence for every media upload/import.
- Add required legal/disclaimer pages before enabling public sharing in production.
- Add album detail view backed by real image metadata.
- Add polished empty states and gallery states.

### Phase 3: External Storage

- Support manual external image URLs first.
- Support Google Drive folder/file link parsing.
- Store external image references in MongoDB.
- Add source refresh/re-sync flow.
- Add thumbnail caching only if needed and affordable.

### Phase 4: Sharing And Delivery

- Parent invite flow.
- Photographer-to-parent album sharing.
- Album permissions.
- Shareable links.
- Download permissions.
- Admin visibility and support tooling.

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local` with at least:

```bash
MONGODB_URI=your-mongodb-uri
NEXTAUTH_URL=http://localhost:3000
SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret
GITHUB_ID=optional-github-client-id
GITHUB_SECRET=optional-github-client-secret
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current Routes

- `/` - Album tile grid
- `/home` - Prototype user/profile grid for signed-in sessions
- `/auth-page` - Sign in/sign up UI
- `/album?albumId=...` - Album detail/upload prototype
- `/album-page` - Static gallery prototype
- `/about` - Static gallery demo
- `/contact` - Placeholder page

## Development Notes

- Use the current app as a prototype foundation, not a finished architecture.
- The main architecture rule is metadata in MongoDB and media in external storage.
- The next major storage decision is which external providers to support first: Google Drive links, S3-compatible storage, manual URLs, or photographer-hosted galleries.
- For auth, role and middleware patterns can be borrowed from the Aivise project as requested.
- Keep image files out of the application database.
- Treat children, albums, image references, and sharing permissions as first-class product objects.
