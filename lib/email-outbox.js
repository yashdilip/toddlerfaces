import EmailOutbox from "../models/emailOutbox";

export const queueEmail = async ({ to, subject, template, payload }) => {
  return EmailOutbox.create({
    to,
    subject,
    template,
    payload,
    status: "queued",
  });
};

const renderTextEmail = (email) => {
  const payload = email.payload || {};
  const lines = [
    email.subject,
    "",
    payload.username ? `Hello ${payload.username},` : "Hello,",
    "",
    payload.albumTitle ? `Album: ${payload.albumTitle}` : "",
    payload.requestedBy ? `Requested by: ${payload.requestedBy}` : "",
    payload.invitedBy ? `Invited by: ${payload.invitedBy}` : "",
    payload.verificationUrl ? `Verify your account: ${payload.verificationUrl}` : "",
    payload.approvalUrl ? `Approve public sharing: ${payload.approvalUrl}` : "",
    payload.inviteUrl ? `Accept invite: ${payload.inviteUrl}` : "",
    payload.expiresAt ? `Expires: ${new Date(payload.expiresAt).toLocaleString()}` : "",
    "",
    "Toddlerfaces keeps albums private by default and records approval actions for audit purposes.",
  ];

  return lines.filter(Boolean).join("\n");
};

const sendWithResend = async (email) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Toddlerfaces <noreply@toddlerfaces.local>",
      to: email.to,
      subject: email.subject,
      text: renderTextEmail(email),
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

const sendWithSendGrid = async (email) => {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: email.to }] }],
      from: { email: process.env.EMAIL_FROM_ADDRESS || "noreply@toddlerfaces.local", name: process.env.EMAIL_FROM_NAME || "Toddlerfaces" },
      subject: email.subject,
      content: [{ type: "text/plain", value: renderTextEmail(email) }],
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return { id: response.headers.get("x-message-id") };
};

export const deliverEmail = async (email) => {
  if (process.env.RESEND_API_KEY) {
    return sendWithResend(email);
  }

  if (process.env.SENDGRID_API_KEY) {
    return sendWithSendGrid(email);
  }

  if (process.env.EMAIL_DELIVERY_MODE === "console") {
    console.log(renderTextEmail(email));
    return { id: `console-${email._id}` };
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY, SENDGRID_API_KEY, or EMAIL_DELIVERY_MODE=console.");
};

export const processQueuedEmails = async ({ limit = 25 } = {}) => {
  const emails = await EmailOutbox.find({ status: "queued" }).sort({ createdAt: 1 }).limit(limit);
  const results = [];

  for (const email of emails) {
    try {
      const providerResult = await deliverEmail(email);
      email.status = "sent";
      email.sentAt = new Date();
      email.payload = {
        ...(email.payload || {}),
        providerResult,
      };
      await email.save();
      results.push({ id: email._id, status: "sent" });
    } catch (error) {
      email.status = "failed";
      email.failureReason = error.message;
      await email.save();
      results.push({ id: email._id, status: "failed", error: error.message });
    }
  }

  return results;
};
