import withPWAInit from "@ducanh2912/next-pwa";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: true, // Temporarily disable PWA to fix build
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: false,
  },
  buildExcludes: [/middleware-manifest\.json$/],
  sw: "sw.js",
});

export default withPWA({
  // Your Next.js config
  reactStrictMode: true,
  images: {
    domains: ["custosbackend.onrender.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "custosbackend.onrender.com",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable cache in development
    if (dev) {
      config.cache = false;
    } else {
      config.cache = {
        type: "filesystem",
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve(__dirname, ".next/cache"),
        maxAge: 5184000000, // 60 days
      };
    }
    return config;
  },
});
