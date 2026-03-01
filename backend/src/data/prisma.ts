import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "../core/utilities/config";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});
