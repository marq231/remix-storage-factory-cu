interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
  theme?: "light" | "dark"
}

export function Logo({ className = "", size = "md", variant = "full", theme = "light" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  // Midnight Blue: #1a365d, Mint Green: #38b2ac
  const midnightBlue = theme === "light" ? "#1a365d" : "#e2e8f0"
  const mintGreen = "#38b2ac"

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon - Letter N with integrated upward arrow */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background rounded square */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="10"
          fill={midnightBlue}
        />
        
        {/* Letter N structure with upward arrow integrated */}
        {/* Left vertical bar of N */}
        <path
          d="M12 36V12"
          stroke={mintGreen}
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Right vertical bar of N (shorter, forms arrow base) */}
        <path
          d="M36 36V20"
          stroke={mintGreen}
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Diagonal connecting stroke */}
        <path
          d="M12 12L36 36"
          stroke={mintGreen}
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Upward arrow on top right */}
        <path
          d="M36 20L36 10M36 10L30 16M36 10L42 16"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Small accent dot */}
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="white"
        />
      </svg>

      {/* Text */}
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span 
            className={`font-bold tracking-tight ${textSize}`}
            style={{ color: midnightBlue }}
          >
            NextFund
          </span>
          <span 
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: mintGreen }}
          >
            US
          </span>
        </div>
      )}
    </div>
  )
}

// Simpler inline version for places where we need just the icon
export function LogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="44" height="44" rx="10" fill="#1a365d" />
      <path d="M12 36V12" stroke="#38b2ac" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 36V20" stroke="#38b2ac" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 12L36 36" stroke="#38b2ac" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 20L36 10M36 10L30 16M36 10L42 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  )
}
