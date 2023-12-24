import type {NextAuthOptions, User} from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProdivder from "next-auth/providers/credentials"
import prisma from "@/../prisma/client";

// Crypto
import crypto from 'crypto';

export const options: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID as string,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            async profile(profile) {

                let user = await prisma.user.findUnique({
                    where: {
                        username: profile.name
                    }
                })

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            username: profile.name
                        }
                    })
                }

                return {
                    id: user.id.toString(),
                    name: user.username,
                }
            },
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
                if (!credentials)
                    return null

                if (process.env.NODE_ENV === "development" && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
                    // check for dev user
                    const devUsername = process.env.ADMIN_USERNAME as string
                    const devPassword = process.env.ADMIN_PASSWORD as string
                    if (credentials.username === devUsername && credentials.password === devPassword)
                        return {id: "0", name: devUsername}
                }

                // get the user with the same userId is the database
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username,
                    },
                })

                if (!user)
                    return null

                // check the user password
                const hashedPassword = crypto.createHash("sha256").update(credentials.password).digest('hex');
                if (hashedPassword === user.password)
                    return {id: user.id.toString(), name: user.username}

                return null
            }
        })
    ],
    pages: {
        signIn: "/login"
    }
}