import styles from "./page.module.css";
import UserButton from "@/components/UserButton";
import ColorAndCountdown from "@/components/Play/ColorAndCountdown";
import { getServerSession } from "next-auth";
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from "next/navigation";

async function Play() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/play');
  }

  const username = session.user!.name ?? "NoName"

  return (
    <>
      <span className={styles.background} />
      <span className={styles.topTitle}>EPIXEL</span>
      <div className={styles.rightContainer}>
        <UserButton userName={username} />
        <ColorAndCountdown />
      </div>
    </>
  );
}

export default Play;
