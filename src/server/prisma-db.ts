import { PrismaClient } from "@prisma/client";
import { env } from "@/env.mjs";

/**
 * The purpose of the line const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }; is to create an object with a prisma property of type PrismaClient | undefined that can be used to store a global instance of the PrismaClient class. 
 * This allows for the reuse of the same instance across multiple requests in the same execution context, which can improve performance by reducing the number of database connections created and taking advantage of query caching.
 */

// Create a variable `globalForPrisma` which is assigned the `globalThis` object cast as an unknown object 
// and then cast as an object with a property `prisma` that can either be of type `PrismaClient` or `undefined`.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export a variable `prisma`
export const prisma =
  // Assign the value of `globalForPrisma.prisma` to `prisma` if it is defined.
  // Otherwise, create a new instance of `PrismaClient` with a log configuration depending on the value of the `NODE_ENV` environment variable.
  globalForPrisma.prisma ?? // `??` is the nullish coalescing operator which returns the value on the left if it is not null or undefined, otherwise it returns the value on the right.
  new PrismaClient({
    // If `NODE_ENV` is "development", log queries, errors, and warnings. Otherwise, only log errors.
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// If the `NODE_ENV` is not "production", assign the `prisma` instance to the `globalForPrisma.prisma` property.
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
