import LoginButton from "@/components/LoginButton";
import styles from "./page.module.css";
import SquareEffect from "@/components/SquareEffect";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home(props: Props) {
  return (
    <>
      <div className={styles.body}>
        <span className={styles.background} />
        <div className={styles.popup}>
          <h1 className={styles.question}>
            Veuillez vous connecter pour accéder au site
          </h1>
          <LoginButton />
          <div className={styles.hint}>
            <div className={styles.hintContent}>Un test de site web en Next.js</div>
            <h1>C&apos;est quoi ce site</h1>
            <FontAwesomeIcon icon={faCircleQuestion} />
          </div>
          <SquareEffect
            foreground="var(--text)"
            background="var(--background)"
            width="15%"
          />
        </div>
      </div>
    </>
  );
}
