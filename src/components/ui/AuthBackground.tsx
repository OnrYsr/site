'use client';

import { useState, useEffect } from 'react';

const backgrounds = [
  {
    id: 1,
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
  },
  {
    id: 2,
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
  },
  {
    id: 3,
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    pattern: 'radial-gradient(circle at 40% 60%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
  },
  {
    id: 4,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    pattern: 'radial-gradient(circle at 25% 75%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
  },
  {
    id: 5,
    gradient: 'from-teal-400 via-cyan-500 to-blue-500',
    pattern: 'radial-gradient(circle at 35% 65%, rgba(20, 184, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
  },
];

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Her 5 saniyede bir değiş

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {backgrounds.map((bg, index) => (
          <div
            key={bg.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentBg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops)) ${bg.pattern}`,
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bg.gradient}`} />
            <div 
              className="absolute inset-0 opacity-20"
              style={{ background: bg.pattern }}
            />
          </div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
} 