import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { AuthService } from "@/server/service/auth";

const authOptions: NextAuthConfig = {
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "username-credentials",
      name: "账号密码登录",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        if (!username || !password) {
          return null;
        }
        const user = await AuthService.loginWithUsernameAndPassword(
          username as string,
          password as string
        );
        if (!user) {
          return null;
        }
        return user;
      },
    }),
  ],
};

const nextAuth: NextAuthResult = NextAuth(authOptions);

export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
