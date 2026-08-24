// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// // export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     // Firebase Configuration
//     NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBewdydGW-TXrJqF083O32Z0myhH5FCgQo",
//     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "all-web-53b0a.firebaseapp.com",
//     NEXT_PUBLIC_FIREBASE_PROJECT_ID: "all-web-53b0a",
//     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "all-web-53b0a.firebasestorage.app",
//     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "815458483540",
//     NEXT_PUBLIC_FIREBASE_APP_ID: "1:815458483540:web:b7b70112796de7b923dcc1",
//     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-YBDSCFD6S5",

//     // RapidAPI Configuration
//     NEXT_PUBLIC_RAPIDAPI_KEY: "19d18205e5mshd88ef12611212d4p155341jsn985d2084edf0",
//     NEXT_PUBLIC_RAPIDAPI_HOST: "jsearch.p.rapidapi.com"
//   }
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// // Conditionally require bundle analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig: NextConfig = {
//   // Environment variables
//   env: {
//     // Firebase Configuration
//     NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBewdydGW-TXrJqF083O32Z0myhH5FCgQo",
//     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "all-web-53b0a.firebaseapp.com",
//     NEXT_PUBLIC_FIREBASE_PROJECT_ID: "all-web-53b0a",
//     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "all-web-53b0a.firebasestorage.app",
//     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "815458483540",
//     NEXT_PUBLIC_FIREBASE_APP_ID: "1:815458483540:web:b7b70112796de7b923dcc1",
//     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-YBDSCFD6S5",

//     // RapidAPI Configuration
//     NEXT_PUBLIC_RAPIDAPI_KEY: "19d18205e5mshd88ef12611212d4p155341jsn985d2084edf0",
//     NEXT_PUBLIC_RAPIDAPI_HOST: "jsearch.p.rapidapi.com"
//   },

//   // Performance Optimizations
//   experimental: {
//     turbo: {
//       rules: {
//         '*.svg': {
//           loaders: ['@svgr/webpack'],
//           as: '*.js',
//         },
//       },
//     },
//   },

//   // Image optimizations
//   images: {
//     domains: [
//       'lh3.googleusercontent.com', // Google auth images
//       'firebasestorage.googleapis.com', // Firebase storage
//       'via.placeholder.com' // Fallback images
//     ],
//     formats: ['image/webp', 'image/avif'], // Modern image formats
//     minimumCacheTTL: 60, // 1 minute cache TTL
//   },

//   // Compiler optimizations
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production', // Remove console logs in production
//   },

//   // Headers for security and performance
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff'
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY'
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block'
//           }
//         ],
//       },
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable', // Cache static assets for 1 year
//           },
//         ],
//       },
//     ];
//   },

//   // Bundle optimization
//   webpack: (config, { isServer }) => {
//     // Optimize moment.js and lodash (if you use them)
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       'moment': 'moment/min/moment.min.js',
//     };

//     // Split chunks for better caching
//     config.optimization = {
//       ...config.optimization,
//       splitChunks: {
//         chunks: 'all',
//         cacheGroups: {
//           default: false,
//           vendors: false,
//           // Vendor chunk
//           vendor: {
//             name: 'vendor',
//             chunks: 'all',
//             test: /node_modules/,
//             priority: 20,
//           },
//           // Common chunks
//           common: {
//             name: 'common',
//             minChunks: 2,
//             chunks: 'all',
//             priority: 10,
//             reuseExistingChunk: true,
//             enforce: true,
//           },
//         },
//       },
//     };

//     return config;
//   },

//   // Enable React strict mode for better debugging
//   reactStrictMode: true,

//   // Enable SWC minification (faster than Terser)
//   swcMinify: true,

//   // Optimize for production
//   poweredByHeader: false, // Remove X-Powered-By header
//   compress: true, // Enable compression
// };

// // Apply bundle analyzer only when enabled
// module.exports = withBundleAnalyzer(nextConfig);


// import type { NextConfig } from "next";

// // Conditionally require bundle analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig: NextConfig = {
//   // Environment variables
//   env: {
//     // Firebase Configuration
//     NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBewdydGW-TXrJqF083O32Z0myhH5FCgQo",
//     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "all-web-53b0a.firebaseapp.com",
//     NEXT_PUBLIC_FIREBASE_PROJECT_ID: "all-web-53b0a",
//     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "all-web-53b0a.firebasestorage.app",
//     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "815458483540",
//     NEXT_PUBLIC_FIREBASE_APP_ID: "1:815458483540:web:b7b70112796de7b923dcc1",
//     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-YBDSCFD6S5",

//     // RapidAPI Configuration
//     NEXT_PUBLIC_RAPIDAPI_KEY: "19d18205e5mshd88ef12611212d4p155341jsn985d2084edf0",
//     NEXT_PUBLIC_RAPIDAPI_HOST: "jsearch.p.rapidapi.com"
//   },

//   // Turbopack configuration (fixed from experimental.turbo)
//   turbopack: {
//     rules: {
//       '*.svg': {
//         loaders: ['@svgr/webpack'],
//         as: '*.js',
//       },
//     },
//   },

//   // Image optimizations
//   images: {
//     domains: [
//       'lh3.googleusercontent.com', // Google auth images
//       'firebasestorage.googleapis.com', // Firebase storage
//     ],
//     formats: ['image/webp', 'image/avif'], // Modern image formats
//     minimumCacheTTL: 60, // 1 minute cache TTL
//   },

//   // Compiler optimizations
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production', // Remove console logs in production
//   },

//   // Headers for security and performance
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff'
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY'
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block'
//           }
//         ],
//       },
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable', // Cache static assets for 1 year
//           },
//         ],
//       },
//     ];
//   },

//   // Enable React strict mode for better debugging
//   reactStrictMode: true,

//   // Optimize for production
//   poweredByHeader: false, // Remove X-Powered-By header
//   compress: true, // Enable compression
// };

// // Apply bundle analyzer only when enabled
// module.exports = withBundleAnalyzer(nextConfig);



// --------------------------------------- worki g one - -------------------------------

// import type { NextConfig } from "next";

// // Conditionally require bundle analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig: NextConfig = {
//   // 🔥 CRITICAL: ESLint and TypeScript ignore during builds
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   // Turbopack configuration (development only)
//   turbopack: {
//   rules: {
//     '*.svg': {
//       loaders: ['@svgr/webpack'],
//       as: '*.js',
//     },
//   },
// },

//   // Image optimizations
//   images: {
//     domains: [
//       'lh3.googleusercontent.com',
//       'firebasestorage.googleapis.com',
//     ],
//     formats: ['image/webp', 'image/avif'],
//     minimumCacheTTL: 60,
//   },

//   // Compiler optimizations
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },

//   // Headers for security
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff'
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY'
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block'
//           }
//         ],
//       },
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//     ];
//   },

//   reactStrictMode: true,
//   poweredByHeader: false,
//   compress: true,
// };

// module.exports = withBundleAnalyzer(nextConfig);

// ------------------- old workinn non gemini code ------------------------------

// import type { NextConfig } from "next";

// // Conditionally require bundle analyzer
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// const nextConfig: NextConfig = {
//   // 🔥 CRITICAL: ESLint and TypeScript ignore during builds
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   // Turbopack configuration (development only)
//   turbopack: {
//     rules: {
//       '*.svg': {
//         loaders: ['@svgr/webpack'],
//         as: '*.js',
//       },
//     },
//   },

//   // Image optimizations
//   images: {
//     domains: [
//       'lh3.googleusercontent.com',
//       'firebasestorage.googleapis.com',
//     ],
//     formats: ['image/webp', 'image/avif'],
//     minimumCacheTTL: 60,
//   },

//   // Compiler optimizations
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },

//   // Headers for security
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff'
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY'
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block'
//           },
//           // 🔥 FIX: Allow Google Sign-In popup to close properly
//           // {
//           //   key: 'Cross-Origin-Opener-Policy',
//           //   value: 'same-origin-allow-popups'
//           // }
//         ],
//       },
//       {
//         source: '/_next/static/(.*)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//     ];
//   },

//   reactStrictMode: true,
//   poweredByHeader: false,
//   compress: true,
// };

// module.exports = withBundleAnalyzer(nextConfig);



import type { NextConfig } from "next";

// Conditionally require bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // 🔥 CRITICAL: ESLint and TypeScript ignore during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Turbopack configuration (development only)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimizations
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
          // The COOP header has been completely removed to allow the Google Popup to communicate with localhost
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

module.exports = withBundleAnalyzer(nextConfig);