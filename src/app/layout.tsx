import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "성남시 생활 정보 | 우리 동네 행사·혜택 소식통",
  description: "성남시와 경기도의 최신 행사, 축제, 지원금 및 혜택 정보를 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className={`${notoSansKr.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
