import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { options as authOptions } from "/src/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

// components
import ColorAndCountdown from "/src/components/Play/ColorAndCountdown";
import GameCanvas from "/src/components/Play/GameCanvas";

async function Play() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/play");
  }

  const username = session.user!.name ?? "NoName";

  return (
    <>
      <span className={styles.background} />
      <GameCanvas />
      <div className={styles.leftContainer}>
        <span className={styles.topTitle}>EPIXEL</span>
        <ColorAndCountdown />
      </div>
    </>
  );
}

export default Play;
