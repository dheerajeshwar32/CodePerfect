export const KycLogo = ({ width = 100, height = 32, className = "" }) => {
  const gradientId = "kyc-electric-blue";
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`select-none shrink-0 text-[#1D1D1F] dark:text-white transition-colors duration-200 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="45" y1="8" x2="65" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="kyc-blue-glow" x="35" y="0" width="40" height="40" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#3B82F6" floodOpacity="0.75" />
        </filter>
      </defs>
      {/* K */}
      <path 
        d="M10 8 V32 M28 8 L14 20 L28 32" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Y - Electric Blue with Ambient Glow */}
      <path 
        d="M45 8 L55 20 L65 8 M55 20 V32" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        filter="url(#kyc-blue-glow)"
        className="drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
      />
      {/* C */}
      <path 
        d="M105 12 A12 12 0 1 0 105 28" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default KycLogo;
