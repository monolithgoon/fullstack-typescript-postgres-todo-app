# Fullstack Typescript, PostgreSQL Todo App

Fullstack Todo app with user authentication, bootstrapped with the [T3 Stack](https://create.t3.gg/) template using `create-t3-app`.

The app ships with the following: tRPC - TypeScript Remote Procedure Call (for end-to-end API type safety), Tailwind CSS for styling, Next.js, Prisma (Node.js & Typescript ORM), and Superbase (PostgreSQL database cloud host).

- Fullstack:

  - [t3.gg](https://createt3.gg): opinionated Next.js starter kit with NextAuth, Prisma, tRPC, Tailwind CSS & TypeScript

- Frontend:
  - [Next.js](https://github.com/vercel/next.js) - a React framework for production.
  - [Tailwind](https://tailwindcss.com/) for styling and layout.
  - [Supabase.js](https://supabase.com/docs/library/getting-started) cloud-hosted Postgres databse for user management and realtime data syncing.
- Backend:
  - [NextAuth.js](https://next-auth.js.org): User authentication for Next.js
  - [trpc.io](https://trpc.io): write end-to-end typesafe APIs without any code generation or runtime bloat
  - [app.supabase.com](https://app.supabase.com/): hosted Postgres database with restful API for usage with Supabase.js.
  - [Prisma.io](https://prisma.io): PostgreSQL database ORM for Node.js & TypeScript

## Deploy with Vercel

The Vercel deployment will guide you through creating a Supabase account and project. After installation of the Supabase integration, all relevant environment variables will be set up so that the project is usable immediately after deployment 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fsupabase%2Fexamples%2Ftree%2Fmain%2Fsupabase-js-v1%2Ftodo-list%2Fnextjs-todo-list&project-name=supabase-todo-list&repository-name=supabase-todo-list&demo-title=Todo%20list&demo-description=An%20example%20web%20app%20using%20Supabase%20and%20Next.js&demo-url=https%3A%2F%2Fsupabase-nextjs-todo-list.vercel.app&demo-image=https%3A%2F%2Fi.imgur.com%2FGJauPlN.png&integration-ids=oac_jUduyjQgOyzev1fjrW83NYOv&external-id=supabase-todo-list)

## Build from scratch

### 1. Clone the GitHub repo and run `npx create t3-app@latest

### 2. Initialize the PostgreSQL database on Supabase

- A. Create new Supabase project

Sign up to Supabase - [https://app.supabase.com](https://app.supabase.com) and create a new project. Wait for your database to start.

- B. Get the URL and Key

Once the database has started, go to the Supabase Project Settings (the cog icon), open the API tab, and find your databse URL. Copy the database URI, and update the `DATABASE_URL` environment variables

- C. Run `prisma db push` to sync the local schema with the cloud Postgres database

## Authors

- Nduka Okpue
