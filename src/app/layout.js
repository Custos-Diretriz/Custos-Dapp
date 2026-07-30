import "./globals.css";
import Footer from "../components/footer";
import Metadata from "./metadata";
import BackgroundWrapper from "../components/backgroundwrapper";
import PrivyProviders from "../components/PrivyProviders";
import { WalletProvider } from "../components/walletprovider";
import { ModalProvider } from "../context/ModalProvider";
import { NotificationProvider } from "../context/NotificationProvider";
import { GlobalStateProvider } from "../context/GlobalStateProvider";
import { Analytics } from "@vercel/analytics/react";

// Add the manifest so that it can be injected at nextjs runtime.
// NOTE: Removing this or moving this to the metadata.js file will not allow the
// InstallPWA component to be loaded from the InstallPWA component.
export const metadata = { ...Metadata, manifest: "/manifest.json" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Custos Diretriz" />
        <meta
          property="og:description"
          content="Custos will secure your Evidences and Agreements"
        />
        <meta
          property="og:image"
          content="https://custosdiretriz.com/banner.png"
        />
        <meta property="og:url" content="https://custosdiretriz.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custos Diretriz" />
        <meta
          name="twitter:description"
          content="Custos will secure your Evidences and Agreements"
        />
        <meta
          name="twitter:image"
          content="https://custosdiretriz.com/banner.png"
        />
        <title>{Metadata.title}</title>
        {Metadata.link}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="flex flex-col border-none min-h-screen justify-between">
        <BackgroundWrapper>
          <NotificationProvider>
            <PrivyProviders>
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
            </PrivyProviders>
          </NotificationProvider>
        </BackgroundWrapper>
      </body>
    </html>
  );
}