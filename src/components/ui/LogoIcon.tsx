// ============================================
// GS SPORT - Logo Icon Component
// Stylized "GS" with lightning bolt slash
// ============================================

interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 100"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* G Letter */}
      <path d="M0 0H70V14H14V86H56V56H38V44H70V100H0Z" />
      {/* Lightning Bolt / Slash */}
      <path d="M106 0L84 44H98L68 100L90 56H76Z" />
      {/* S Letter */}
      <path d="M110 0H180V14H124V42H180V100H110V86H166V56H110Z" />
    </svg>
  );
}
