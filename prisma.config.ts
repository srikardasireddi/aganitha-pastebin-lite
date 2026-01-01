import "dotenv/config";

// We remove 'defineConfig' to avoid the "already declared" error
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    // This uses the standard Node.js process.env to get your URL
    url: process.env.DATABASE_URL,
  },
};