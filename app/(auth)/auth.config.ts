import NextAuth, {
  NextAuthConfig,
  NextAuthResult,
  User as NextAuthUser,
} from "next-auth";

const protectedPages = ["/dash"];

export type AuthUser = NextAuthUser;

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token as any;
      }
      return session;
    },
    authorized: async ({ request, auth }) => {
      const nextUrl = request.nextUrl;
      const url = nextUrl.pathname;
      const from = nextUrl.searchParams.get("from");
      const isLogined = !!auth?.user;
      const isOnLoginPage = url.startsWith("/login");
      // 已登录且是登录页面，则重定向到 from 或首页
      if (isOnLoginPage && isLogined) {
        return Response.redirect(
          new URL(
            from && !from.startsWith("http") ? `${from}` : "/",
            nextUrl as unknown as URL
          )
        );
      }
      // 未登录，且访问的是登录页，则允许访问
      if (isOnLoginPage && !isLogined) {
        return true;
      }
      // 已登录，且访问的是受保护页面，则允许访问
      // 未登录，且访问的是受保护页面，则重定向到登录页
      const isProtectedPage = protectedPages.some((page) =>
        url.startsWith(page)
      );
      if (isProtectedPage && !isLogined) {
        return Response.redirect(
          new URL(`/login?from=${nextUrl.pathname}`, nextUrl as unknown as URL)
        );
      }

      return true;
    },
  },
};

const nextAuth: NextAuthResult = NextAuth(authConfig);

export const auth: NextAuthResult["auth"] = nextAuth.auth;
