// src/app/Metadata.js

const APP_NAME = "Custos";
const APP_DEFAULT_TITLE = "Custos Diretriz";
const APP_TITLE_TEMPLATE = "%s - Custos Diretriz";
const APP_DESCRIPTION = "The New Blockchain Safe";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/favicon.png",
    apple: [{ url: "/ios/180.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#000000",
};

// Export the metadata object for use in layout.tsx
export default metadata;
