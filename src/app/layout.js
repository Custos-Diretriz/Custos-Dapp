import "./globals.css";
import Footer from "@/components/footer";
import "@rainbow-me/rainbowkit/styles.css";
import Metadata from "./metadata";
import BackgroundWrapper from "@/components/backgroundwrapper";
import { WalletProvider } from "@/components/walletprovider";
import { ModalProvider } from "@/context/ModalProvider";
import { NotificationProvider } from "@/context/NotificationProvider";
import { GlobalStateProvider } from "@/context/GlobalStateProvider";

// Add the manifest so that it can be injected at nextjs runtime.
// NOTE: Removing this or moving this to the metadata.js file will not allow the
// InstallPWA component to be loaded from the InstallPWA component.
export const metadata = { ...Metadata, manifest: "/manifest.json" };

export default function RootLayout({ children }) {
  //  const pathname = usePathname();

  // if (pathname.includes("/crimerecorder")) {
  //   return (
  //     <html lang="en">
  //       <head>
  //         <title>404 Not Found</title>
  //       </head>
  //       <body className="flex flex-col min-h-screen justify-between">
  //         <BackgroundWrapper>
  //           <div className="w-full flex flex-col justify-center items-center min-h-screen">
  //             <h1 className="text-4xl text-white">404 - Page Not Found</h1>
  //           </div>
  //         </BackgroundWrapper>
  //       </body>
  //     </html>
  //   );
  // }

  return (
    <html lang="en">
      <head>
        <title>{Metadata.title}</title>
        {Metadata.link}
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="flex flex-col min-h-screen justify-between">
        <BackgroundWrapper>
          <NotificationProvider>
            <WalletProvider>
              <ModalProvider>
                <div className="w-full flex flex-col justify-between">
                  <div className="min-h-screen w-full ">
                    <GlobalStateProvider>{children}</GlobalStateProvider>
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
