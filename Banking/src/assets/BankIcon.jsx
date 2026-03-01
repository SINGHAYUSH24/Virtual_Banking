const BankIcon = ({ size = 20, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
  >
    {/* Background */}
    <rect
      x="0.5"
      y="0.5"
      width="19"
      height="19"
      rx="4"
      fill="hsl(206, 84%, 13%)"
      opacity="0.15"
    />

    {/* Roof */}
    <path
      d="M4 8L10 4L16 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Columns */}
    <line x1="6" y1="8" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" />
    <line x1="9" y1="8" x2="9" y2="14" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" />
    <line x1="15" y1="8" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" />

    {/* Base */}
    <line
      x1="4"
      y1="14"
      x2="16"
      y2="14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default BankIcon;