import withPWAInit from "@ducanh2912/next-pwa";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: false,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: false,
    navigateFallbackDenylist: [/^\/api\//],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/auth\.privy\.io\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /\/api\/guest-save/i,
        handler: "NetworkOnly",
      },
    ],
  },
});

export default withPWA({
  reactStrictMode: true,
  images: {
    // Most of the UI chrome (nav icons, bell, success screen, loading logo) is
    // SVG served from /public. Without this the optimizer answers every one of
    // them with 400 "image type is not allowed". Sandboxed and script-less, so
    // a hostile SVG still can't execute.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
  // `webpack` here is Next's own bundled instance — plugins built from the
  // standalone `webpack` package won't attach to this compiler.
  webpack: (config, { dev, isServer, webpack }) => {
    // --- Privy optional dependencies ---------------------------------
    // Privy lazily references modules for features we don't enable
    // (fiat onramp, Farcaster mini-apps, React Native). pnpm's strict
    // node_modules won't resolve them, so ignore them at the bundler.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^(@farcaster\/.*|@stripe\/crypto|react-native|@react-native-async-storage\/async-storage)$/,
      })
    );

    // Explicit aliases for the ones already seen — belt and braces,
    // and clearer than a regex when someone reads this later.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@stripe/crypto": false,
      "@farcaster/mini-app-solana": false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.externals = config.externals || [];
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // --- Your existing cache setup -----------------------------------
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