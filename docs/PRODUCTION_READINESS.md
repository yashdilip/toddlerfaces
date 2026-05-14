# Toddlerfaces Production Readiness

Use this checklist before and during launch.

## 1. Environment

Required:

- `MONGODB_URI`
- `NEXTAUTH_URL`
- `SECRET`
- `JWT_SECRET`

Recommended:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY`
- `RESEND_API_KEY` or `SENDGRID_API_KEY`
- `EMAIL_FROM`

Local/dev fallback:

- `EMAIL_DELIVERY_MODE=console`

Before launch, verify production `NEXTAUTH_URL` matches the live domain exactly.

## 2. MongoDB

- Use a production MongoDB cluster.
- Enable authentication and IP/network restrictions.
- Enable backups and point-in-time recovery if available.
- Create indexes for common lookup fields after traffic begins:
  - `User.email`
  - `Album.owner`
  - `Image.album`
  - `PublicApprovalRequest.tokenHash`
  - `ShareInvite.tokenHash`
  - `AuditLog.createdAt`
  - `EmailOutbox.status`
- Confirm no test users, test albums, or demo child records remain.

## 3. Admin Setup

Admin signup is intentionally blocked.

To create an admin:

1. Sign up normally as a parent or photographer.
2. Verify the account.
3. Update the MongoDB user document directly:

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", updatedAt: new Date() } }
)
```

4. Log out and log back in.
5. Confirm `/dashboard` shows admin tools.

## 4. Email

Choose one provider before launch:

- Resend: set `RESEND_API_KEY`.
- SendGrid: set `SENDGRID_API_KEY`.

Then:

- Set `EMAIL_FROM` to a verified sender.
- Create a test user.
- Confirm verification email is queued.
- Process email outbox from admin dashboard.
- Confirm email delivery.
- Test invite email delivery.
- Test public approval email delivery.

Do not rely on console mode in production.

## 5. Google Drive Picker

In Google Cloud Console:

- Create OAuth client credentials.
- Add production domain to authorized JavaScript origins.
- Add production callback URL for NextAuth.
- Enable Google Picker/API access.
- Set Drive readonly scope.
- Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- Set `NEXT_PUBLIC_GOOGLE_DRIVE_PICKER_API_KEY`.
- Set server-side `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

Manual check:

- Open an album.
- Click Google Drive Picker.
- Complete OAuth.
- Select multiple images.
- Confirm image references appear in album metadata.
- Confirm original files remain in Drive.

## 6. Legal And Safety

Before launch:

- Attorney review of Terms.
- Attorney review of Privacy Policy.
- Attorney review of Child Privacy Notice.
- Attorney review of Cookie Policy.
- Attorney review of Data Collection Notice.
- Attorney review of Public Sharing Disclaimer.
- Attorney review of Photographer Agreement.
- Attorney review of Deletion and Retention Policy.
- Attorney review of Content Rights/DMCA language.
- Confirm legal pages match actual data collection and providers.

Important:

- Do not launch public child albums until approval flow, moderation gate, email delivery, and audit logs are verified.
- Keep child albums private by default.
- Do not add behavioral analytics or advertising pixels to public child album pages.

## 7. Moderation

Current production gate:

- Manual admin moderation queue.
- Public approval fails unless all album images are `approved`.

Before allowing public sharing at scale:

- Decide whether manual review is enough for launch volume.
- Add automated provider if needed:
  - Google Cloud Vision SafeSearch.
  - Amazon Rekognition.
  - Azure AI Content Safety.
  - OpenAI moderation for supported media workflows.
- Define escalation policy for suspected illegal child exploitation or abuse material.
- Define takedown and account suspension process.

## 8. Access Control Checks

Regression checks:

- Parent can create child profile.
- Parent can create album.
- Photographer can create album.
- Admin cannot be created through signup.
- Admin can log in after DB role promotion.
- Non-owner cannot update private albums.
- Invitee can accept invite only with invited email.
- Public approval requires parent consent token.
- Public approval fails if media is not moderation-approved.
- Public album is visible after approval.
- Revoked public album no longer behaves as public.

## 9. QA Commands

Run before deploy:

```bash
npm run lint
npm test
npm run build
npm audit
```

Run browser smoke:

- `/`
- `/auth-page`
- `/dashboard`
- `/album?albumId=demo`
- `/drive-picker?albumId=demo`
- `/storage-strategy`
- `/privacy`
- `/terms`
- `/public-sharing-disclaimer`
- `/approve/public/demo-token`
- `/share/invite/demo-token`
- `/verify-email/demo-token`

## 10. Deployment

Before going live:

- Confirm env vars exist in hosting provider.
- Confirm build command is `npm run build`.
- Confirm start command is `npm start` if using a Node host.
- Confirm `next build --webpack` succeeds on the host.
- Confirm MongoDB network access from host.
- Confirm public domain works with NextAuth cookies.
- Confirm HTTPS.
- Confirm no secrets are committed.
- Confirm CSP/security headers if added by hosting provider.

## 11. Launch Day

Do:

- Create admin account through DB promotion.
- Run QA commands.
- Verify email delivery.
- Verify Drive Picker.
- Verify manual moderation queue.
- Create a test parent, photographer, child, album, invite, media reference, approval request, and public album.
- Delete test data.
- Monitor server logs.
- Monitor email provider logs.
- Monitor MongoDB metrics.

Do not:

- Enable public sharing without email and moderation checks.
- Store original media in app storage.
- Add advertising or third-party tracking to child album pages.
- Launch without attorney review if public child sharing is enabled.
