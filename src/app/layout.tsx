import "./globals.css";
import Footer from "../components/footer";
import metadata from "./metadata";
import BackgroundWrapper from "../components/backgroundwrapper";
import { WalletProvider } from "../components/walletprovider";
import { ModalProvider } from "../context/ModalProvider";
import { NotificationProvider } from "../context/NotificationProvider";
import { GlobalStateProvider } from "../context/GlobalStateProvider";
import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import React from "react";
import { JSX } from "react/jsx-runtime";

// Export metadata for Next.js app router
export { metadata };

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Custos Diretriz" />
        <meta property="og:description" content="Custos will secure your Evidences and Agreements" />
        <meta property="og:image" content="https://custosdiretriz.com/banner.png" />
        <meta property="og:url" content="https://custosdiretriz.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custos Diretriz" />
        <meta name="twitter:description" content="Custos will secure your Evidences and Agreements" />
        <meta name="twitter:image" content="https://custosdiretriz.com/banner.png" />
        <title>{metadata.title.default}</title>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="flex flex-col border-none min-h-screen justify-between">
        <BackgroundWrapper>
          <NotificationProvider>
            <WalletProvider>
              <ModalProvider>
                <div className="w-full flex flex-col justify-between">
                  <div className="min-h-screen w-full remove-safari-border">
                    <GlobalStateProvider>
                      {children}
                      <Analytics />
                    </GlobalStateProvider>
                  </div>
                  <div className="h-fit">
                    <Footer />
                  </div>
                </div>
              </ModalProvider>
            </WalletProvider>
          </NotificationProvider>
        </BackgroundWrapper>
      </body>
    </html>
  );
}


