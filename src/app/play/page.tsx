import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Play from "./play";
import { headers } from "next/headers";

async function PlayServer() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/play");
  }

  const username = session.user!.name ?? "NoName";

  // test if the user agent is a mobile
  const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(
    headers().get("user-agent") ?? ""
  );

  return (
    <Play
      // TODO
      isMobileDevice={isMobileDevice}
      username={username}
      pusherKey={process.env.PUSHER_KEY as string}
      pusherCluster={process.env.PUSHER_CLUSTER as string}
    />
  );
}

export default PlayServer;
