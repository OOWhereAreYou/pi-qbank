export type ServiceReturn<T> = {
  status: "success" | "error";
  message: string;
  data: T | null;
};

type WrappedService<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Promise<ServiceReturn<R>>
    : T[K];
};

export const withErrorHandler = <T extends Record<string, any>>(
  service: T
): WrappedService<T> => {
  const wrappedService: WrappedService<T> = {} as WrappedService<T>;

  for (const key in service) {
    if (typeof service[key] === "function") {
      wrappedService[key] = (async (...args: any[]) => {
        try {
          const result = await service[key](...args);
          return {
            status: "success" as const,
            message: "操作成功",
            data: result,
          };
        } catch (error: any) {
          return {
            status: "error" as const,
            message: error.message || "操作失败",
            data: null,
          };
        }
      }) as any; // Type assertion to any for simplicity, will refine if needed
    } else {
      wrappedService[key] = service[key];
    }
  }
  return wrappedService;
};
