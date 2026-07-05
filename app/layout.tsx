import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift Access Portal",
  description: "A secret PS5 Pro gift unlock experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
