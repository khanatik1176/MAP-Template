import React from 'react';

interface PingDotProps {
  color: string; // Base color for the dot (e.g., 'bg-red-600', 'bg-blue-400')
}

const PingDot: React.FC<PingDotProps> = ({ color }) => {
  const baseColor = color.replace('bg-', ''); // Extract the color name (e.g., 'red-600')
  return (
    <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
      <span
        className={`absolute inline-flex w-4 h-4 rounded-full animate-ping`}
        style={{ backgroundColor: `rgba(var(--tw-${baseColor}), 0.3)` }} // Add opacity manually
      />
      <span className={`inline-flex w-2 h-2 rounded-full ${color}`} />
    </span>
  );
};

export default PingDot;