export default function BriefingIllustration() {
  return (
    <svg
      viewBox="0 0 800 220"
      fill="none"
      style={{ width: '100%', maxWidth: 700, opacity: 0.07 }}
    >
      {/* Table */}
      <rect x="180" y="145" width="440" height="8" rx="4" fill="#FF4562" />
      <rect x="210" y="153" width="8" height="55" rx="2" fill="#FF4562" />
      <rect x="580" y="153" width="8" height="55" rx="2" fill="#FF4562" />
      {/* Screen/whiteboard */}
      <rect
        x="310"
        y="20"
        width="180"
        height="110"
        rx="6"
        stroke="#FF4562"
        strokeWidth="2.5"
      />
      <rect x="390" y="130" width="20" height="15" fill="#FF4562" />
      {/* Chart on screen */}
      <polyline
        points="330,95 355,75 380,85 405,55 430,65 455,45 470,50"
        stroke="#FF4562"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="325"
        y1="100"
        x2="475"
        y2="100"
        stroke="#FF4562"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Person 1 - left, seated */}
      <circle cx="230" cy="100" r="16" stroke="#FF4562" strokeWidth="2.5" />
      <path
        d="M230 116 C210 130 210 145 230 145 C250 145 250 130 230 116z"
        fill="#FF4562"
      />
      {/* Person 2 - left center */}
      <circle cx="300" cy="95" r="16" stroke="#FF4562" strokeWidth="2.5" />
      <path
        d="M300 111 C280 125 280 145 300 145 C320 145 320 125 300 111z"
        fill="#FF4562"
      />
      {/* Person 3 - right center */}
      <circle cx="500" cy="95" r="16" stroke="#FF4562" strokeWidth="2.5" />
      <path
        d="M500 111 C480 125 480 145 500 145 C520 145 520 125 500 111z"
        fill="#FF4562"
      />
      {/* Person 4 - right, seated */}
      <circle cx="570" cy="100" r="16" stroke="#FF4562" strokeWidth="2.5" />
      <path
        d="M570 116 C550 130 550 145 570 145 C590 145 590 130 570 116z"
        fill="#FF4562"
      />
      {/* Person 5 - standing, presenting */}
      <circle cx="400" cy="40" r="0" />
      <circle cx="540" cy="55" r="18" stroke="#FF4562" strokeWidth="2.5" />
      <path
        d="M540 73 C515 90 515 145 540 145 C565 145 565 90 540 73z"
        fill="#FF4562"
      />
      {/* Pointer arm */}
      <line
        x1="525"
        y1="90"
        x2="490"
        y2="70"
        stroke="#FF4562"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
