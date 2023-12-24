import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from "next/navigation";

// components
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";
import GameCanvas from "@/components/GameCanvas";

async function Play() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/play');
  }

  const username = session.user!.name ?? "NoName"

  return (
    <>
      <span className={styles.background} />
      <GameCanvas/>
      <span className={styles.topTitle}>EPIXEL</span>
      <div className={styles.rightContainer}>
        <ColorAndCountdown />
      </div>
    </>
  );
}

export default Play;
