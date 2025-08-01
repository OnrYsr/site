import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import PrivateWrapper from "@/components/providers/PrivateWrapper";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muse3DStudio - 3D Ürünler",
  description: "En kaliteli 3D ürünler ve modeller",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <PrivateWrapper>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </PrivateWrapper>
        </Providers>
      </body>
    </html>
  );
}
