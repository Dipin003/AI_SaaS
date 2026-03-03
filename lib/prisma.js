import {PrismaClient} from "@prisma/client"

export const db = globalThis.prisma ||new PrismaClient()

if(process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

// gloablTHis.prisma: THe global variable ensures that the Prisma client instance is reused across hot reloads during development. without this , each time your application
// relods, a new instance of the prisma client would be created, potentially leading to connection issues..