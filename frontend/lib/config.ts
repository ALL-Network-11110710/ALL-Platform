// // lib/config.ts
// export const firebaseConfig = {
//   apiKey: "AIzaSyBewdydGW-TXrJqF083O32Z0myhH5FCgQo",
//   authDomain: "all-web-53b0a.firebaseapp.com",
//   projectId: "all-web-53b0a",
//   storageBucket: "all-web-53b0a.firebasestorage.app",
//   messagingSenderId: "815458483540",
//   appId: "1:815458483540:web:b7b70112796de7b923dcc1",
//   measurementId: "G-YBDSCFD6S5"          
// };

// export const rapidApiConfig = {
//   key: "19d18205e5mshd88ef12611212d4p155341jsn985d2084edf0",
//   host: "jsearch.p.rapidapi.com"
// };


// TEMPORARY FIX - Environment variables not loading
// Using hardcoded values to restore functionality

// Environment-based configuration for ALL Platform

// Firebase Configuration - uses environment variables
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// RapidAPI Configuration - uses environment variables  
export const rapidApiConfig = {
  key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
  host: process.env.NEXT_PUBLIC_RAPIDAPI_HOST || ""
};

// Validation function (for debugging)
export const validateEnvironment = () => {
  if (typeof window !== "undefined") {
    console.log("Environment variables test:");
    console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "LOADED" : "MISSING");
    console.log("RapidAPI Key:", process.env.NEXT_PUBLIC_RAPIDAPI_KEY ? "LOADED" : "MISSING");
  }
};

// Run validation
validateEnvironment();