import * as bcrypt from "bcryptjs"; // 注意这里导入的是 bcryptjs

const DEFAULT_SALT_ROUNDS = 4; // 默认的加盐轮数, bcryptjs 性能可能不如C++版 bcrypt, 注意调整

/**
 * 哈希（加密）密码
 * @param plainTextPassword 明文密码
 * @param saltRounds 加盐轮数 (可选, 默认为 DEFAULT_SALT_ROUNDS).
 *                   对于 bcryptjs, 10-12 通常是较好的起点. 过高会显著影响性能.
 * @returns Promise<string> 哈希后的密码字符串
 * @throws Error 如果哈希过程中发生错误
 */
export async function hashPassword(
  plainTextPassword: string,
  saltRounds: number = DEFAULT_SALT_ROUNDS
): Promise<string> {
  if (!plainTextPassword) {
    throw new Error("Password cannot be empty.");
  }
  // bcryptjs 对 saltRounds 的具体限制可能与 C++ bcrypt 不同，但原理一致
  // 通常，4 是一个非常低的下限，不建议低于 8-10。
  // bcryptjs 纯JS实现，性能会比原生 bcrypt 慢，所以 saltRounds 不宜设置过高 (例如超过 14-15) 除非经过充分测试。
  if (saltRounds < 4) {
    console.warn(
      `Salt rounds ${saltRounds} is very low. Using a minimum of 4 for safety, but consider 10+ for production.`
    );
    saltRounds = 4; // 绝对最小值，但强烈建议更高
  }
  if (saltRounds > 15 && process.env.NODE_ENV === "production") {
    // 在生产中给个警告
    console.warn(
      `Salt rounds ${saltRounds} is very high for bcryptjs and may significantly impact performance. Consider a value between 10-12.`
    );
  }

  try {
    // bcryptjs.hash 同样会自动生成盐并将其包含在最终的哈希字符串中
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password with bcryptjs:", error);
    throw new Error("Failed to hash password.");
  }
}

/**
 * 比较明文密码和哈希后的密码是否匹配
 * @param plainTextPassword 用户输入的明文密码
 * @param hashedPassword 存储在数据库中的哈希密码
 * @returns Promise<boolean> 如果匹配则为 true，否则为 false
 * @throws Error 如果比较过程中发生错误 (例如 hashedPassword 格式不正确)
 */
export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string | undefined | null
): Promise<boolean> {
  if (!plainTextPassword || !hashedPassword) {
    console.warn(
      "Plain text password or hashed password is empty for comparison with bcryptjs."
    );
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password with bcryptjs:", error);
    // bcryptjs.compare 可能会因为 hashedPassword 格式无效而抛出错误
    // 这种情况通常意味着密码不匹配，或者数据损坏
    return false;
  }
}
