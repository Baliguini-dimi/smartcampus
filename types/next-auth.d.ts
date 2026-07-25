import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    tenantId: number | null;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      tenantId: number | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    tenantId: number | null;
  }
}
