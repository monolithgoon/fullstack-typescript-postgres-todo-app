# Fullstack Typescript, PostgreSQL Todo App

> Fullstack Todo app with user authentication using email magic links, GitHub & Google OAuth, bootstrapped with the [T3 Stack](https://create.t3.gg/) template using `create-t3-app`.

## Overview

### [Deployed fullstack app](https://vercel.com/monolithgoon/fullstack-typescript-postgres-todo-app)

The app ships with the following: tRPC - which stands for TypeScript Remote Procedure Call (for end-to-end API type safety), Tailwind CSS for styling, Next.js, Prisma (Node.js & Typescript ORM), and Superbase (PostgreSQL database cloud host).

- Frontend:
  - [Next.js](https://github.com/vercel/next.js) - a React framework for production
  - [Tailwind CSS](https://tailwindcss.com/) for styling and layout.
- Backend:
  - [NextAuth.js](https://next-auth.js.org): User authentication for Next.js
  - [trpc.io](https://trpc.io): write end-to-end typesafe APIs without any code generation or runtime bloat
  - [app.supabase.com](https://app.supabase.com/): cloud-hosted Postgres database with restful API for user management and real-time data syncing
  - [Prisma.io](https://prisma.io): PostgreSQL database ORM for Node.js & TypeScript

## Local Setup 🛠

### 1. Clone the GitHub repo

- In the command line, run `git clone https://github.com/mangyfiend/fullstack-typescript-postgres-todo-app.git`

- Run `npm install` to install all the project dependencies


- Create a .env file with the following variables

```bash
  # When adding additional environment variables, the environment variables validation schema in
  # "/src/env.mjs" should be updated accordingly.

  # Supabase
  DATABASE_URL=""

  # Next Auth
  # You can generate a new Next Auth secret on the command line with:
  # openssl rand -base64 32
  # https://next-auth.js.org/configuration/options#secret
  NEXTAUTH_SECRET=""
  NEXTAUTH_URL="http://127.0.0.1:3000"

  # Next Auth Github Provider
  GITHUB_CLIENT_ID=""
  GITHUB_CLIENT_SECRET=""

  # Next Auth Google Provider
  GOOGLE_CLIENT_ID=""
  GOOGLE_CLIENT_SECRET=""

  # Email Auth Provider
  EMAIL_SERVER_HOST=""
  EMAIL_SERVER_PORT="587"
  EMAIL_SERVER_PASSWORD=""
  EMAIL_SERVER_USER=""
  EMAIL_FROM="verifyemail@default.com"

```

### 2. Initialize a PostgreSQL database on Supabase ⚡

- Create new Supabase project

  Sign up to Supabase - [https://app.supabase.com](https://app.supabase.com) and create a new project. Wait for your database to start.

- Get the database URL

  Once the database has started, go to the Supabase Project Settings (the cog icon), open the API tab, and find your databse URL. Copy the database URI, and update the `DATABASE_URL` environment variables

- Run `prisma db push` to sync the local Prisma schema with the Supabase PostgreSQL database. This sets up the relational database tables and whatnot for Postgres on Supabase

### 3. Get a NextAuth Secret 🔑

  In your command line terminal, run `openssl rand -base64 32`, copy the returned value, and update the `NEXTAUTH_SECRET` variable in your `.env` file with the value

### 4. Setup OAuth 2.0 with GitHub 🔗

Follow the steps outlined in this Scribe to create a GitHub OAuth Client ID & Secret.

Open the GitHub [Developer Settings](https://github.com/settings/developers)

- Go to the GitHub website and sign in to your account.

- Click on your profile picture in the top right corner of the screen and select "Settings" from the drop-down menu.

- Click on the "Developer settings" tab in the left sidebar and then select "OAuth Apps".

- Click the "New OAuth App" button to create a new OAuth application.

- Fill in the "Application name" (eg. `fullstack-todo-app-dev`) and "Homepage URL" fields with the appropriate information for your app.

- In the "Authorization callback URL" field, enter the URL that GitHub should redirect to after a user authorizes your app. For your local build, use `http://localhost:3000/callback` or `http://127.0.0.1:3000/callback` (assuming you are using port 3000 for your local server). For your production build, use the URL of your production server followed by "/callback".

- Click the "Register application" button at the bottom of the page.

- On the next page, you will see the "Client ID" and "Client Secret" values. Copy these values and store them in a secure place, as they will be required to authenticate your app with GitHub.

- Repeat steps 4-8 to create a second OAuth app for your production build. Make sure to use the appropriate URLs and application names (eg. `fullstack-todo-app-prod`) for your production environment.

- Once you have both sets of Client IDs and Secrets, you can use them in your app code to authenticate with GitHub's OAuth API.

- For your local build, update the `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` variables in the `.env` file

### 5. Setup OAuth 2.0 with Google

To set up a Google provider for NextAuth.js, you will need to follow these steps:

- Go to the Google Developers Console and create a new project if you haven't already.

- [Follow the steps outlined here](https://support.google.com/cloud/answer/6158849?hl=en#zippy=%2Cstep-create-a-new-client-secret%2Cauthorized-domains)

- Copy the "Client ID" and "Client Secret" values from the Google Cloud Console and paste them into your Next.js app's .env file. For example: 

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### 6. Start the project

Verify that your environment variables have been setup correctly.

- Run `npm run dev` to start the project on `http://127.0.0.1:3000`


## Deploy with Vercel

Follow these steps to deploy the app to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fsupabase%2Fexamples%2Ftree%2Fmain%2Fsupabase-js-v1%2Ftodo-list%2Fnextjs-todo-list&project-name=supabase-todo-list&repository-name=supabase-todo-list&demo-title=Todo%20list&demo-description=An%20example%20web%20app%20using%20Supabase%20and%20Next.js&demo-url=https%3A%2F%2Fsupabase-nextjs-todo-list.vercel.app&demo-image=https%3A%2F%2Fi.imgur.com%2FGJauPlN.png&integration-ids=oac_jUduyjQgOyzev1fjrW83NYOv&external-id=supabase-todo-list)

- Create a Vercel account if you don't already have one.

- In the Vercel dashboard, click the `Import Project` button.

- Select the `From Git Repository` option.

- Choose your Git provider (in this case, GitHub) and authenticate your account.

- Select the repository that contains the Todo app.

- Choose the branch you want to deploy (usually the main branch).

- Configure your project settings. You can choose your build command, output directory, and environment variables here. To set environment variables, click the `Environment Variables` button and add the key-value pairs you need. For example, you might need to set a API_URL variable to the URL of your API endpoint.

- Click `Deploy` and wait for the build to complete.

Once the build is complete, you can preview your app by clicking the `Visit` button. You can also configure custom domains, set up SSL certificates, and configure other deployment settings from the Vercel dashboard.

To connect your Vercel project to your GitHub account, you can enable the Vercel for GitHub integration. This allows you to automatically deploy your app whenever you push changes to your GitHub repository. To enable the integration, go to the `Integrations` section of the Vercel dashboard, find the "Vercel for GitHub" integration, and click "Install". Follow the instructions to connect your GitHub account and select the repositories you want to deploy.

## Author

- Nduka Okpue
