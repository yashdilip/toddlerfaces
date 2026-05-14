# Toddlerfaces App Source Of Truth

This document is the product and architecture source of truth for Toddlerfaces. Keep the GitHub README short; keep product behavior, safety rules, and implementation direction here.

## Product Goal

Toddlerfaces is a memory-first child photo album app for adult parents, photographers, and admins. It should feel like a beautiful long-term place for family memories, not a generic file store.

The app is intended for adults only:

- Parents create and manage child albums.
- Photographers create or deliver albums for parent clients.
- Admins handle safety, moderation, audit review, and operational support.
- Children do not create accounts or directly provide information.

## Core Principles

- Private by default.
- Metadata in MongoDB, media in user-controlled external storage.
- Parent consent before public child albums.
- Photographer public sharing requires parent consent by email.
- Every media action requires legally binding attestation.
- Attestation is not enough by itself; moderation and admin review remain part of the safety system.
- Public publishing requires moderation approval and email approval.
- Audit records should exist for sensitive account, upload, sharing, approval, moderation, and deletion actions.
- The app must not sell children’s data or use behavioral advertising on child album pages.
- Face recognition/biometric processing should not be added without legal review.

## Roles

### Parent

- Create account as `parent`.
- Create child profiles.
- Create child-linked albums.
- Attach external media references.
- Invite private viewers.
- Request public sharing.
- Approve public sharing requests sent to their email.
- Revoke public sharing.

### Photographer

- Create account as `photographer`.
- Create photographer delivery albums.
- Attach external media references from a gallery, Drive, S3/R2, or other provider.
- Request public sharing only with parent consent email approval.
- Invite parent/client viewers where allowed.

### Admin

- Cannot self-signup publicly.
- Must be promoted manually in MongoDB.
- Can inspect operational dashboards.
- Can review moderation queue.
- Can process email outbox.
- Can view audit logs.
- Can manage safety and support workflows.

## Storage Model

Toddlerfaces should not become the long-term original media storage owner.

MongoDB stores:

- Users and roles.
- Adult eligibility and legal acceptance timestamps.
- Child profiles.
- Album metadata.
- Image/media references.
- Provider/source metadata.
- Visibility and permissions.
- Public approval requests.
- Share invites.
- Email outbox records.
- Upload attestations.
- Moderation status.
- Audit logs.

External providers store original media:

- Google Drive.
- Dropbox.
- OneDrive.
- S3/R2 or S3-compatible storage.
- Photographer-hosted galleries.
- Direct external URLs.

Local binary upload is disabled in the production path.

## Public Sharing Workflow

Albums and images must not become public from a single click.

Required album flow:

1. Parent or photographer requests public sharing.
2. App records a public approval request.
3. App sends/queues an email to the parent consent email.
4. Parent/account holder opens the approval link.
5. Parent accepts the public sharing disclaimer.
6. App verifies token, expiry, and request state.
7. App verifies all album images are moderation-approved.
8. App changes album visibility to `public`.
9. App records audit metadata.
10. Parent/admin can later revoke public sharing.

Photographer-created public albums require parent consent email approval.

## Upload And Media Attestation

Every external media attachment requires the uploader to attest:

- They are an adult.
- They are authorized to use the account.
- They own the media or have permission to attach it.
- They have parent/legal guardian permission where required.
- The media does not include illegal, exploitative, abusive, non-consensual, nude, violent, or otherwise restricted content.
- They understand public sharing requires a separate approval workflow.
- They understand original media remains in the external provider.

The app records attestation metadata on image records and audit logs.

## Moderation

Current implementation:

- Media references are created with moderation status.
- Admin dashboard includes a manual moderation queue.
- Admin can approve, mark needs-review, or block media.
- Public approval cannot complete until all album images are approved.

Future provider integration:

- Google Cloud Vision SafeSearch.
- Amazon Rekognition DetectModerationLabels.
- Azure AI Content Safety.
- OpenAI moderation for supported image/text moderation workflows.

Automated moderation must not replace human escalation for uncertain or high-risk material.

## Email

The app uses a MongoDB-backed `EmailOutbox`.

Email types:

- Account verification.
- Album invite.
- Public sharing parent consent approval.

Delivery options:

- Resend via `RESEND_API_KEY`.
- SendGrid via `SENDGRID_API_KEY`.
- Console mode via `EMAIL_DELIVERY_MODE=console`.

Admins can process queued emails from the dashboard.

## Implemented Features

- Adult-only signup requirements.
- Parent/photographer role signup.
- Admin signup blocked.
- Credentials login for parent, photographer, admin.
- Optional Google OAuth provider with Drive readonly scope.
- Child profile model/API/UI.
- Album model/API/UI.
- Image reference model/API/UI.
- External storage source flow.
- Google Drive Picker page with multi-select.
- Bulk selected-link import.
- Private invite model/API/UI.
- Public approval request model/API/UI.
- Public album page.
- Public sharing revocation.
- Email verification workflow.
- Email outbox processing.
- Manual admin moderation queue.
- Audit log model and admin view.
- Static legal/transparency pages.
- Dark/light responsive UI.
- Smoke tests.

## Known External Production Dependencies

- Attorney review of legal pages.
- Real email provider credentials.
- Google OAuth/Picker credentials.
- MongoDB production deployment and backups.
- Automated content moderation provider if/when selected.

## Non-Goals

- Child accounts.
- Behavioral advertising.
- Selling child data.
- Face recognition or biometric tagging without explicit legal review.
- App-owned original media storage as the default production path.
