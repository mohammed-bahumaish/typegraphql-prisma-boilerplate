import { PrismaClient } from "@prisma/client";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "./prisma/generated/type-graphql";
import path from "path";
import { ApolloServer } from "apollo-server";

interface Context {
  prisma: PrismaClient;
}

async function main() {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
    validate: false,
  });

  const prisma = new PrismaClient({ log: ["query"] });
  await prisma.$connect();

  const server = new ApolloServer({
    schema,
    context: (): Context => ({ prisma }),
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
