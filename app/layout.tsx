import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinHance - Умное управление финансами",
  description: "Приложение для управления личными финансами с аналитикой и целями",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
