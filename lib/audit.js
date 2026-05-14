import AuditLog from "../models/auditLog";

export const requestMeta = (req) => ({
  ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
  userAgent: req.headers["user-agent"] || "",
});

export const writeAuditLog = async (req, action, details = {}) => {
  const sessionUser = req.sessionUser || {};
  return AuditLog.create({
    actor: sessionUser.id,
    actorEmail: sessionUser.email,
    actorRole: sessionUser.role,
    action,
    targetType: details.targetType,
    targetId: details.targetId?.toString?.() || details.targetId,
    album: details.album,
    child: details.child,
    metadata: details.metadata || {},
    policyVersions: {
      terms: "terms-v1",
      privacy: "privacy-v1",
      childPrivacy: "child-privacy-v1",
      publicSharing: "public-sharing-disclaimer-v1",
      uploadAttestation: "upload-attestation-v1",
      ...details.policyVersions,
    },
    ...requestMeta(req),
  });
};
