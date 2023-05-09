import { TRPCError } from "@trpc/server";
import { type SignupSchemaType, signupSchema } from "@/utils/validation";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { hash } from "argon2";

// async function hashPassword(password: string): Promise<ReturnType<typeof hash>> {
//   const hashedPassword: ReturnType<typeof hash> = await hash(password);
//   return hashedPassword;
// }

// async function hashPassword2(password: string): Promise<ReturnType<typeof hash>> {
//   const hashedPassword: string = await hash(password) as string;
//   return hashedPassword;
// }

export const signupRouter = createTRPCRouter({

  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {

      const { username, email, password }: SignupSchemaType = input;

      const userExistsChk = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (userExistsChk) {
        throw new TRPCError({
          code: `CONFLICT`,
          message: `User already exists`,
        });
      }
      
      // const hashedPassword = await hash(password);
      // const hashedPassword: ReturnType<typeof hash> = await hash(password);
      console.log({ password })
      const hashedPassword = "ban guns";

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword }
      });

      return {
        status: 201,
        message: `Account created successfully`,
        result: result.email,
      }
    }),
});

export type SignupRouterType = typeof signupRouter;
