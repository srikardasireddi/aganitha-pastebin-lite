import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Adjust the path below to match where your 'npx prisma generate' put the files
import { PrismaClient } from '../generated/prisma/client';
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Create a connection pool using your URL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Initialize the Prisma 7 Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the constructor (This fixes your error!)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter } as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;