import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/trpc-api";
import "@/styles/globals.css";

// Wrap your code with the SessionProvider and set the session.

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
     // Wrapping the main component with the SessionProvider component and passing the session object
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

// The MyApp component is exported with the withTRPC higher-order function from the `trpc-api` module. 
// This function adds the ability to use the tRPC library for remote procedure calls in the app.
export default api.withTRPC(MyApp);
