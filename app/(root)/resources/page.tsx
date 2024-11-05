import React from 'react';
import { HardHat, Hammer, Construction } from 'lucide-react';

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 bg-yellow-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 space-y-6">
        <div className="flex justify-center items-center gap-4 mb-8">
          <HardHat className="w-16 h-16 text-yellow-400 animate-bounce" />
          <Construction className="w-16 h-16 text-yellow-400 animate-pulse" />
          <Hammer className="w-16 h-16 text-yellow-400 animate-bounce" />
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">
          Under Construction
        </h1>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="text-xl text-slate-300 max-w-md mx-auto">
          {' '}
          Check back soon to see what we're creating!
        </p>
      </div>

      {/* Warning stripes corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden">
        <div className="bg-yellow-400 rotate-45 transform origin-top-left h-4 w-64 -translate-y-8" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden">
        <div className="bg-yellow-400 rotate-45 transform origin-bottom-right h-4 w-64 translate-y-8" />
      </div>
    </div>
  );
};

export default Page;
