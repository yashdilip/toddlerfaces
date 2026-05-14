import { dbConnect } from "../../lib/db-connect";
import User from '../../models/user';
import bcrypt from 'bcrypt';
import { createToken, daysFromNow, hashToken } from "../../lib/tokens";
import { queueEmail } from "../../lib/email-outbox";


export default async function handler(request, response) {

  try {
    await dbConnect();
  } catch (error) {
    return response.status(500).json({ message: "Connection failed." });
  }

  if (request.method === "POST") {

    if (!request.body) {
      return response.status(404).json({message: "Don't have form data...!"})
    }

    const { username, email, password, role, birthMonth, birthYear, legalAccepted } = request.body;
    const normalizedRole = role === "photographer" ? "photographer" : "parent";
    const parsedBirthMonth = Number(birthMonth);
    const parsedBirthYear = Number(birthYear);
    const currentYear = new Date().getFullYear();

    if (role === "admin") {
      return response.status(403).json({ message: "Admin accounts cannot be created through signup." })
    }

    if (!["parent", "photographer"].includes(role)) {
      return response.status(400).json({ message: "Signup role must be parent or photographer." })
    }

    if (!legalAccepted) {
      return response.status(400).json({ message: "Legal attestation is required." })
    }

    if (!parsedBirthMonth || parsedBirthMonth < 1 || parsedBirthMonth > 12 || !parsedBirthYear) {
      return response.status(400).json({ message: "Birth month and year are required." })
    }

    if (currentYear - parsedBirthYear < 18) {
      return response.status(403).json({ message: "Toddlerfaces accounts are for adults only." })
    }

    const checkExiting = await User.findOne({ email })

    if (checkExiting) {
      return response.status(422).json({ message: "User already exists...!" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = createToken();

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: normalizedRole,
      birthMonth: parsedBirthMonth,
      birthYear: parsedBirthYear,
      adultAttestedAt: new Date(),
      legalAcceptedAt: new Date(),
      emailVerification: {
        tokenHash: hashToken(verificationToken),
        expiresAt: daysFromNow(7),
        sentAt: new Date(),
      },
    })

    const validationError = user.validateSync();
    if (validationError) {
      return response.status(400).json({ error: validationError })
    }

    await user.save()

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    await queueEmail({
      to: email,
      subject: "Verify your Toddlerfaces account",
      template: "email_verification",
      payload: {
        username,
        verificationUrl: `${baseUrl}/verify-email/${verificationToken}`,
        expiresAt: user.emailVerification.expiresAt,
      },
    });

    return response.status(201).json({ message: "User created successfully...!"})

  }
};
