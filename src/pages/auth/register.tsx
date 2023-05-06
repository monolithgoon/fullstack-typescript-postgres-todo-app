import Head from "next/head";
// import Layout from "@/layout/layout";
import Link from "next/link";
import styles from "@/styles/RegisterForm.module.css";
import Image from "next/image";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useState } from "react";

export default function Register() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>

      <section className="mx-auto flex w-3/4 flex-col gap-10">
        <div className="title">
          <h1 className="py-4 text-4xl font-bold text-gray-800">Explore</h1>
          <p className="mx-auto w-3/4 text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
            officia?
          </p>
        </div>

        {/* form */}
        <form className="flex flex-col gap-5">
          <div className={styles.input_group}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
            />
            <span className="icon flex items-center px-4">
              <HiAtSymbol size={25} />
            </span>
          </div>
          <div className={styles.input_group}>
            <input
              type={`${show ? "text" : "password"}`}
              name="password"
              placeholder="password"
              className={styles.input_text}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShow(!show)}
            >
              <HiFingerPrint size={25} />
            </span>
          </div>

          {/* login buttons */}
          <div className="input-button">
            <button type="submit" className={styles.button}>
              Login
            </button>
          </div>
          <div className="input-button">
            <button type="button" className={styles.button_custom}>
              Sign In with Google{" "}
              <Image src={"/assets/google.svg"} width="20" height={20}></Image>
            </button>
          </div>
          <div className="input-button">
            <button type="button" className={styles.button_custom}>
              Sign In with Github{" "}
              <Image src={"/assets/github.svg"} width={25} height={25}></Image>
            </button>
          </div>
        </form>

        {/* bottom */}
        <p className="text-center text-gray-400 ">
          don&apost have an account yet?{" "}
          <Link href={"/register"}>
            <a className="text-blue-700">Sign Up</a>
          </Link>
        </p>
      </section>
    </div>
  );
}
