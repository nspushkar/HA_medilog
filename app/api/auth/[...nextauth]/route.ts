import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Optional: Add custom callbacks if needed later
  // callbacks: {
  //   async session({ session, user }) {
  //     // Add user.id to the session object
  //     session.user.id = user.id;
  //     return session;
  //   }
  // }
})

export { handler as GET, handler as POST }