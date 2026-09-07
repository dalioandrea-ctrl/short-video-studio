import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopee Video AI",
  description: "Transforme links de produtos em roteiros e criativos para vídeos verticais.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
