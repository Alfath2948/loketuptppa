/**
 * FloralFrame — dekorasi daun & bunga sederhana (SVG) untuk membingkai foto petugas.
 * Ditempatkan di belakang foto oval. Murni dekoratif, tidak mengganggu keterbacaan.
 */
export function FloralFrame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ranting kiri bawah */}
      <g stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round">
        <path d="M40 210 Q25 180 30 150" />
        <path d="M34 190 Q22 186 16 178" />
        <path d="M32 170 Q20 166 14 158" />
        <path d="M31 152 Q40 146 48 148" />
      </g>
      {/* Daun kiri */}
      <g fill="#A7F3D0">
        <ellipse cx="16" cy="176" rx="7" ry="4" transform="rotate(-40 16 176)" />
        <ellipse cx="14" cy="156" rx="7" ry="4" transform="rotate(-40 14 156)" />
      </g>
      <g fill="#DDD6FE">
        <ellipse cx="48" cy="148" rx="7" ry="4" transform="rotate(30 48 148)" />
      </g>

      {/* Bunga kiri bawah */}
      <g>
        <circle cx="42" cy="214" r="9" fill="#DDD6FE" />
        <circle cx="42" cy="214" r="4" fill="#A78BFA" />
        <circle cx="30" cy="222" r="6" fill="#FBCFE8" />
        <circle cx="30" cy="222" r="2.5" fill="#F472B6" />
      </g>

      {/* Ranting kanan atas */}
      <g stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round">
        <path d="M160 40 Q175 70 170 100" />
        <path d="M166 60 Q178 64 184 72" />
        <path d="M168 82 Q180 86 186 94" />
        <path d="M169 100 Q160 106 152 104" />
      </g>
      {/* Daun kanan */}
      <g fill="#A7F3D0">
        <ellipse cx="184" cy="74" rx="7" ry="4" transform="rotate(-40 184 74)" />
        <ellipse cx="186" cy="94" rx="7" ry="4" transform="rotate(-40 186 94)" />
      </g>
      <g fill="#DDD6FE">
        <ellipse cx="152" cy="104" rx="7" ry="4" transform="rotate(30 152 104)" />
      </g>

      {/* Bunga kanan atas */}
      <g>
        <circle cx="158" cy="36" r="9" fill="#DDD6FE" />
        <circle cx="158" cy="36" r="4" fill="#A78BFA" />
        <circle cx="170" cy="28" r="6" fill="#FBCFE8" />
        <circle cx="170" cy="28" r="2.5" fill="#F472B6" />
      </g>
    </svg>
  )
}
