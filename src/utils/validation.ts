import { z } from "zod"
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/api/app-router";

/**
 * The `inferRouterOutputs` type is used to automatically infer the type of the output of the AppRouter type.
 * 
 * Then, a new type called `TodosListOutputType` is defined based on the selected type of the `getAllTodos` method of the `todos` endpoint of the `AppRouter`.
 * 
 * This type is an array of todo items, with each item being of a specific type that is selected using a number index signature.
 *
 * Finally, a new type called `TodoItemType` is defined based on the type of each item in the array of todo items. This type can be used elsewhere in the code to ensure consistency and type safety when dealing with todo items.
 */

// Use `infer` to automatically infer the type of the output of the `AppRouter` type
type AppRouterOutputType = inferRouterOutputs<AppRouter>;

// Select the output type of the `getAllTodos` method of the router,
// which is an array of todo items, and use `number` index signature to select the type of each item
type TodosListOutputType = AppRouterOutputType["todos"]["getAllTodos"];

// Define a `TodoItemType` type based on the selected type of each item in the array
export type TodoItemType = TodosListOutputType[number];

// Define a schema validation object for a todo input using the `zod` library
export const TodoInputSchema = z.object({
  text: z.string({ required_error: "A todo must have text" }).min(2).max(50),
});

// 
export const loginSchema = z.object({
  email: z.string({ required_error: `A login email must is required`}).email(),
  password: z.string({ required_error: `A login password is required`}).min(4)
});

// Define a schema for user sign up using the zod library.
// The schema extends an existing loginSchema object by adding a new "username" field with a minimum length of 4 characters and a custom error message for when the field is required but not present.
export const signupSchema = loginSchema.extend({ 
  // name: z.string({ required_error: `A username is required for sign up`}).min(4),
  username: z.string({ required_error: `A username is required for sign up`}).min(4),
});

// Define two type aliases for the loginSchema and signupSchema objects.
// The LoginSchemaType alias represents the inferred type of the loginSchema object.
// The SignupSchemaType alias represents the inferred type of the signupSchema object.
// These type aliases can be used elsewhere in the code to enforce type safety and prevent type errors.
// For example, when validating user input or defining API response types.
export type LoginSchemaType = z.infer<typeof loginSchema>
export type SignupSchemaType = z.infer<typeof signupSchema>;
