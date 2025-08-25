"use client";

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text 
}: LoadingSpinnerProps) {
  console.log("LoadingSpinner: Component rendered with", { size, color, text });

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-primary',
    secondary: 'border-gold-primary',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-2 border-transparent 
          ${colorClasses[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}