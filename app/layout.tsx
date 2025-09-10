import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";
import { DialogProvider } from "@/components/hooks/use-dialog";

export const metadata: Metadata = {
  title: "题库系统",
  description: "走美杯题库",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <link rel="icon" href="/globe.svg" />
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DialogProvider>
            {children}
            <Toaster />
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
