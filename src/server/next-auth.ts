import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma-db";
import { env } from "@/env.mjs";
import { verify } from "argon2";
import { loginSchema } from "@/utils/validation";
import { logErrorWithContext } from "@/utils/error-handler";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST || "http://127.0.0.1:3000",
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM || "no-reply@example.com",

      ...(env.NODE_ENV !== "production"
        ? {
            sendVerificationRequest({ url }) {
              console.log("LOGIN LINK", url);
            },
          }
        : {}),
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialProvider({
      id: "credentials-1",
      name: "Email & Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "ndukao@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      // Using an if type guard to ensure credentials isn't null
      // authorize: async (credentials, request) => {
      //   try {
      //     if (credentials !== undefined) {
      //       const dbUser = await prisma.user.findFirst({where: { email: credentials.email }})
      //       if (dbUser !== null) {
      //         // Compare the passsword hashes
      //       };
      //     } else {
      //       console.log(`Credentials not provided`);
      //       return null;
      //     }
      //   } catch (err) {
      //     console.log(`Hash not matched loggin in`);
      //     return null
      //   }
      // },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);
          const dbUser = await prisma.user.findFirst({
            where: { email: email },
          });
          if (!dbUser) {
            console.log(`User with email ${email} not found`);
            return null;
          }
          if (!dbUser.password) {
            console.log(`User with email ${email} does not have a password`);
            return null;
          }
          // Compare the passsword hashes
          console.dir({ dbUser });
          if (!dbUser.password) {
            console.log(
              `User not registered with password: ${email}`
            );
            return null;
          }
          const isValidPassword = await verify(dbUser.password, password);
          if (!isValidPassword) {
            console.log(
              `Incorrect password provided for user with email: ${email}`
            );
            return null;
          }
          // REMOVE => CAUSING TYPE ISSUES
          // const dbUserDetails = {
          //   userId: dbUser.id,
          //   username: dbUser?.username,
          //   userPhoto: dbUser.image,
          //   userEmail: dbUser.email,
          //   userEmailVerifiedDate: dbUser.emailVerified,
          // }
          // return dbUserDetails;
          return dbUser;
        } catch (err: unknown) {
          logErrorWithContext(err, "Error occured while loggin in:");
          return null;
        }
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],

  pages: {
    // signIn: "/auth/signin",
    // signIn: "/auth/cred-signin",
    newUser: "/auth/sign-up",
  },
};

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
