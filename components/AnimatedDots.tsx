  export const AnimatedDots = () => (
    <span aria-hidden className="inline-flex items-center ml-2">
      <span className="w-2 h-2 bg-blue-600 rounded-full mr-1 animate-dot-bounce" />
      <span className="w-2 h-2 bg-blue-600 rounded-full mr-1 animate-[dot-bounce_1s_infinite_0.15s]" />
      <span className="w-2 h-2 bg-blue-600 rounded-full animate-[dot-bounce_1s_infinite_0.3s]" />
    </span>
  );