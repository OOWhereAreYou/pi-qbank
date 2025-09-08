import { comparePassword, hashPassword } from "@/lib/bcrypt";
import { prisma } from "../lib/db";

export const AuthService = {
  init: async () => {
    const result = await prisma.user.create({
      data: {
        username: "admin",
        passwordHash: await hashPassword("pi@314"),
        role: "ADMIN",
      },
    });
    console.log(result);
  },
  loginWithUsernameAndPassword: async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("用户不存在");
    }
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  },
};
