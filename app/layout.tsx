import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import config from "./config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});
export const metadata: Metadata = {
  title: {
    default: "GIA PHẢ HỌ NGUYỄN BỈM SƠN",
    template: "%s | GIA PHẢ HỌ NGUYỄN BỈM SƠN",
  },
  description:
    "GIA PHẢ HỌ NGUYỄN BỈM SƠN - Nền tảng gia phả hiện đại & bảo mật. Gìn giữ và lưu truyền những giá trị, cội nguồn và truyền thống tốt đẹp của dòng họ cho các thế hệ mai sau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased relative`}
      >
        {children}
      </body>
    </html>
  );
}
