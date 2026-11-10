import React from 'react';

export const KycLogo = ({ className = "h-8 w-auto", idPrefix = "kyc" }) => {
  const gradientId = `${idPrefix}-siri-gradient`;
  
  return (
    <svg 
      viewBox="0 0 160 50" 
      className={`select-none shrink-0 ${className}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="25" y1="10" x2="137" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2A54" />
          <stop offset="33%" stopColor="#FF9B00" />
          <stop offset="66%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#A800FF" />
        </linearGradient>
      </defs>
      
      {/* K */}
      <path 
        d="M25 10 V40 M50 10 L31 25 L50 40" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Y */}
      <path 
        d="M70 10 L85 25 L100 10 M85 25 V40" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* C */}
      <path 
        d="M137 14 A 15 15 0 1 0 137 36" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default KycLogo;
