import React from 'react';

interface LipstickKissMarkProps {
  className?: string;
  tilted?: boolean;
}

export const LipstickKissMark: React.FC<LipstickKissMarkProps> = ({
  className = 'w-20 h-14',
  tilted = true,
}) => {
  return (
    <svg
      viewBox="0 0 180 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${tilted ? '-rotate-8' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cherryGloss" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#F23850" />
          <stop offset="55%" stopColor="#D91E36" />
          <stop offset="100%" stopColor="#9B0D20" />
        </radialGradient>
        <filter id="lipStampTexture" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter="url(#lipStampTexture)">
        {/* Upper Lip */}
        <path
          d="M16 56C28 32 54 19 76 28C84 31 87 36 90 36C93 36 96 31 104 28C126 19 152 32 164 56C142 61 116 56 90 52C64 56 38 61 16 56Z"
          fill="url(#cherryGloss)"
        />

        {/* Lower Lip */}
        <path
          d="M24 66C52 62 128 62 156 66C145 94 118 106 90 105C62 106 35 94 24 66Z"
          fill="url(#cherryGloss)"
        />

        {/* Organic lip-crease lines */}
        <path
          d="M42 38C45 45 46 50 47 54M60 31C62 40 63 47 64 52M78 33C79 41 80 46 80 51M102 33C101 41 100 46 100 51M120 31C118 40 117 47 116 52M138 38C135 45 134 50 133 54"
          stroke="#7A0918"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        <path
          d="M45 71C47 80 50 87 53 92M65 69C66 81 67 91 69 98M90 68C90 82 90 93 90 101M115 69C114 81 113 91 111 98M135 71C133 80 130 87 127 92"
          stroke="#7A0918"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Glossy specular highlights */}
        <path
          d="M46 42C56 35 67 34 74 37"
          stroke="#FAF3E8"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeOpacity="0.38"
        />
        <path
          d="M104 86C116 84 126 79 134 73"
          stroke="#FAF3E8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeOpacity="0.34"
        />
      </g>
    </svg>
  );
};
