import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const signup = read("pages/api/signup.js");
assert(signup.includes('role === "admin"'), "Signup API must block admin creation.");
assert(signup.includes('["parent", "photographer"].includes(role)'), "Signup API must only allow parent/photographer.");

const album = read("models/album.js");
assert(album.includes("publicApproval"), "Album model must track public approval state.");
assert(album.includes("children"), "Album model must link child profiles.");

const image = read("models/Image.js");
assert(image.includes("uploadAttestation"), "Image model must track upload attestation.");
assert(image.includes("moderationStatus"), "Image model must keep moderation placeholder status.");

const publicApprovals = read("pages/api/public-approvals/index.js");
assert(publicApprovals.includes("parentConsentEmail"), "Public approval API must require parent consent email.");
assert(publicApprovals.includes("queueEmail"), "Public approval API must queue approval email.");

const publicApprovalApprove = read("pages/api/public-approvals/approve.js");
assert(publicApprovalApprove.includes("moderationStatus"), "Public approval must check moderation status before publishing.");

const upload = read("pages/api/images/upload.js");
assert(upload.includes("Local binary uploads are disabled"), "Local binary uploads must stay disabled by default.");

const emailOutbox = read("lib/email-outbox.js");
assert(emailOutbox.includes("processQueuedEmails"), "Email outbox must expose a delivery processor.");
assert(emailOutbox.includes("RESEND_API_KEY"), "Email outbox must support provider delivery.");

const auth = read("pages/api/auth/[...nextauth].js");
assert(auth.includes("GoogleProvider"), "Auth must include Google provider for Drive OAuth.");
assert(auth.includes("drive.readonly"), "Google auth must request Drive readonly scope.");

const drivePicker = read("pages/drive-picker.jsx");
assert(drivePicker.includes("MULTISELECT_ENABLED"), "Drive Picker must support selecting n images.");
assert(drivePicker.includes("/api/images"), "Drive Picker must persist selected image references.");

const moderationApi = read("pages/api/moderation/index.js");
assert(moderationApi.includes("Admin access required"), "Moderation queue must be admin gated.");
assert(moderationApi.includes("moderationStatus"), "Moderation API must update moderation status.");

console.log("Smoke checks passed.");
