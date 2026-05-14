import crypto from "crypto";

export const createToken = () => crypto.randomBytes(32).toString("hex");

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
