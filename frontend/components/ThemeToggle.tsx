// 'use client';

// import { useState, useEffect } from 'react';

// export default function ThemeToggle() {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');
//   const [mounted, setMounted] = useState(false);

//   // Initialize theme from localStorage or system preference
//   useEffect(() => {
//     setMounted(true);
//     const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
//     const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
//     const initialTheme = savedTheme || systemTheme;
    
//     setTheme(initialTheme);
//     applyTheme(initialTheme);
//   }, []);

//   // Apply theme to document
//   const applyTheme = (newTheme: 'light' | 'dark') => {
//     const root = document.documentElement;
    
//     // Remove both classes first
//     root.classList.remove('light', 'dark');
//     // Add the current theme class
//     root.classList.add(newTheme);
//     // Update data-theme attribute
//     root.setAttribute('data-theme', newTheme);
//     // Save to localStorage
//     localStorage.setItem('theme', newTheme);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     applyTheme(newTheme);
//   };

//   // Show loading state until mounted
//   if (!mounted) {
//     return (
//       <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
//         <span className="text-sm">...</span>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center w-10 h-10"
//       aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//       title={`Current: ${theme} mode`}
//     >
//       {theme === 'light' ? '🌙' : '☀️'}
//     </button>
//   );
// }