import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Todos } from "../components/Todos";
import { CreateTodo } from "../components/CreateTodo";

function Home() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Fullstack Typescript + PostgreSQL Todo App</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 bg-white">
          {sessionData && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 p-8" style={{border: "1px solid black", backgroundColor: "white"}}>
                <h3 className="text-xl font-bold">TODOS</h3>
                <Todos />
                <CreateTodo />
              </div>
            </div>
          )}
          <div
            className="flex flex-col items-center gap-2"
            style={{ backgroundColor: "whitesmoke", padding: "5rem", border: "1px solid black" }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-l text-center">
                {sessionData && (
                  <span>Logged in as {sessionData.user?.email}</span>
                )}
              </p>
              <button
                className="w-full bg-black px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "SIGN OUT" : "SIGN IN"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
