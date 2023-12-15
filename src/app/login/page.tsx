import LoginInPage from "./login"
import {getServerSession} from "next-auth";
import {options as authOptions} from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation";

export default async function loginChecker({searchParams} : {searchParams: { [key: string]: string | string[] | undefined }}) {
    const session = await getServerSession(authOptions);

    const callbackUrl = (searchParams.callbackUrl ?? "/") as string
    
    if (session)
        redirect(callbackUrl);

    return <LoginInPage callbackUrl={callbackUrl} />
}