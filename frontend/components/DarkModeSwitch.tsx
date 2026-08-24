// 'use client';

// import { useState, useEffect } from 'react';

// export default function DarkModeSwitch() {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     // Only run on client
//     setMounted(true);
    
//     // Get initial theme
//     const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
//     const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
//     let initialTheme: 'light' | 'dark' = 'light';
//     if (saved) {
//       initialTheme = saved;
//     } else if (systemDark) {
//       initialTheme = 'dark';
//     }
    
//     setTheme(initialTheme);
//     applyTheme(initialTheme);
//   }, []);

//   const applyTheme = (newTheme: 'light' | 'dark') => {
//     const html = document.documentElement;
    
//     // Remove all theme classes
//     html.classList.remove('light', 'dark');
//     // Add the current theme
//     html.classList.add(newTheme);
//     // Update data attribute
//     html.setAttribute('data-theme', newTheme);
//     // Save to localStorage
//     localStorage.setItem('theme', newTheme);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     applyTheme(newTheme);
    
//     // Log for debugging
//     console.log('Theme toggled to:', newTheme);
//     console.log('HTML classes:', document.documentElement.classList);
//   };

//   // CRITICAL FIX: Use bg-gray-200 to match server rendering
//   if (!mounted) {
//     return (
//       <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
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