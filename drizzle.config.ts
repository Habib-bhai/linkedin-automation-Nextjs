import "dotenv/config";
// import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle/migrations',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_STRING!
  },
};