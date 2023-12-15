import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function Home() {
  redirect("/login?callbackUrl=/play")
  return (
    <>
      <h1>Epixel</h1>
    </>
  )
}
