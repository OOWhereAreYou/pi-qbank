import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date // 保留Date等特殊对象类型
  ? T
  : T extends (infer U)[] // 处理数组
  ? RecursivelyReplaceNullWithUndefined<U>[]
  : T extends object // 处理对象
  ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
  : T; // 处理原始类型

export function nullsToUndefined<T>(
  obj: T
): RecursivelyReplaceNullWithUndefined<T> {
  // 1. 基本情况：如果输入是 null，直接返回 undefined
  if (obj === null) {
    return undefined as unknown as RecursivelyReplaceNullWithUndefined<T>;
  }

  // 2. 数组处理：如果是数组，递归处理每一项
  if (Array.isArray(obj)) {
    return obj.map(
      nullsToUndefined
    ) as unknown as RecursivelyReplaceNullWithUndefined<T>;
  }

  // 3. 对象处理：确保是可遍历的对象
  if (typeof obj === "object" && obj !== null) {
    // 使用 reduce 来构建新对象，类型更易于管理
    return Object.keys(obj).reduce((acc, key) => {
      const k = key as keyof T;
      const value = obj[k];
      acc[k] = nullsToUndefined(value); // 递归调用
      return acc;
    }, {} as { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }) as RecursivelyReplaceNullWithUndefined<T>;
  }

  // 4. 原始类型：如果不是对象/数组/null，直接返回
  return obj as unknown as RecursivelyReplaceNullWithUndefined<T>;
}
