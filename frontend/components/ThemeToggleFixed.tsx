// 'use client';

// import { useTheme } from '@/contexts/ThemeContext';
// import { useState, useEffect } from 'react';

// export default function ThemeToggleFixed() {
//   const { theme, toggleTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Show nothing until mounted to prevent any hydration mismatch
//   if (!mounted) {
//     return null;
//   }

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
//       aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
//     >
//       {theme === 'light' ? '🌙' : '☀️'}
//     </button>
//   );
// }