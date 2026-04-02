import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "社会人のチートマニュアル",
  description: "社会人のための学び・仕事・情報収集サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-900 antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="社会人のチートマニュアル ロゴ"
                width={80}
                height={80}
                className="h-16 w-16 shrink-0 rounded-xl object-contain"
                priority
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold tracking-wide text-zinc-900 sm:text-base">
                  社会人のチートマニュアル
                </div>
                <div className="truncate text-xs text-zinc-500">
                  知らないと損する、社会人の攻略法
                </div>
              </div>
            </Link>

            <nav className="shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  scroll={true}
                  className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
                >
                  ホーム
                </Link>

                
              </div>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}