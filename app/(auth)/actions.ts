"use server";

import { z } from "zod";

import { auth, signIn, signOut } from "./auth";
import { AuthUser } from "./auth.config";

export const getAuthUser = async () => {
  const _auth = await auth();
  return _auth?.user as AuthUser | undefined;
};

const UsernameLoginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(4).max(20),
});

// 登录
export const loginWithUsername = async (
  data: z.infer<typeof UsernameLoginSchema>
) => {
  const { username, password } = data;
  try {
    await signIn("username-credentials", {
      username,
      password,
      redirect: false,
    });
    return {
      message: "登录成功",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "登录失败",
    };
  }
};

// 退出登录
export const logout = async () => {
  try {
    const result = await signOut({
      redirect: false,
    });
    return {
      status: "success",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const initAdmin = async () => {
  // await AuthService.init();
};
