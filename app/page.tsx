import { getAuthUser } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const user = await getAuthUser();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-6 row-start-2 items-center text-center">
        <h1 className="text-4xl font-bold">欢迎来到题库系统</h1>
        <p className="text-muted-foreground">一个内部使用的题库系统。</p>
        {user ? (
          <Link href="/dash">
            <Button>进入工作台</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button>登录</Button>
          </Link>
        )}
      </main>
      <footer className="row-start-3 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Pi-QBank</p>
      </footer>
    </div>
  );
}
