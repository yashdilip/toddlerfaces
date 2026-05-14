import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "../../../lib/mongodb";
import { dbConnect } from "../../../lib/db-connect";
import User from "../../../models/user";

const validateAllOnce = (fields) => {
  for (let key in fields) {
    if (fields[key].trim() === "") {
      throw new Error(`${key} required`)
    }
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })] : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })] : []),
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        const { email, password } = credentials;

        validateAllOnce({ email, password });

        //db connect
        await dbConnect();

        const user = await User.findOne({ email }).exec();

        if (!user) {
          throw new Error("Something went wrong");
        }

        const userDoc = user._doc;
        const isMatched = await bcrypt.compare(password, userDoc.password);

        if (user && isMatched) {
          // Any object returned will be saved in `user` property of the JWT
          delete userDoc.password;
          return userDoc;
        } else {
          // If you return null or false then the credentials will be rejected
          //return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error("error message") // Redirect to error page
          throw new Error("Email or Password Incorrect..!");
          // Redirect to a URL
        }
      },
      credentials: {},
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  debug: process.env.NODE_ENV === "development",
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString?.() || user.id;
        token.role = user.role || "parent";
        token.username = user.username || user.name;
        token.emailVerifiedAt = user.emailVerifiedAt || null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "parent";
        session.user.username = token.username;
        session.user.emailVerifiedAt = token.emailVerifiedAt;
      }

      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.SECRET,
}

export default NextAuth(authOptions)
