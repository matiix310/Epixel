import { getServerSession } from "next-auth";
import { options as authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Play from "./play";

async function PlayServer() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/play");
  }

  const username = session.user!.name ?? "NoName";

  return (
    <Play
      username={username}
      pusherKey={process.env.PUSHER_KEY as string}
      pusherCluster={process.env.PUSHER_CLUSTER as string}
    />
  );
}

export default PlayServer;
