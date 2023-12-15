import type {NextAuthOptions} from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProdivder from "next-auth/providers/credentials"
import prisma from "@/../prisma/client";

export const options: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID as string,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
            tenantId: process.env.AZURE_AD_TENANT_ID,
        }),
        CredentialsProdivder({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jadormatiix"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                const user = {id: "0", name: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD}

                if (credentials?.username === user.name && credentials?.password === user.password)
                    return user

                return null
            }
        })
    ],
    pages: {
        signIn: "/login"
    }
}