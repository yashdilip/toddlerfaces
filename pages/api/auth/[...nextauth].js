import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { dbConnect } from "../../../lib/db-connect";
import bcrypt from "bcrypt";
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
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        const { email, username, password } = credentials;

        console.log({ email, username, password });

        validateAllOnce({ email, username, password });

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
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.SECRET,
}

export default NextAuth(authOptions)