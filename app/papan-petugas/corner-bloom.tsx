/**
 * CornerBloom — rangkaian bunga & daun dekoratif (SVG) untuk sudut layar / section.
 * Murni dekoratif (aria-hidden). Warna lembut ungu-pink-hijau senada tema.
 */
export function CornerBloom({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ranting utama */}
      <g stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M10 210 C 40 180, 60 150, 70 110" />
        <path d="M10 210 C 50 200, 90 190, 130 185" />
        <path d="M40 178 C 30 165, 22 158, 12 154" />
        <path d="M56 150 C 46 138, 40 132, 30 128" />
        <path d="M70 118 C 62 104, 58 98, 50 92" />
        <path d="M78 188 C 88 176, 96 170, 108 166" />
        <path d="M112 186 C 122 176, 132 172, 144 170" />
      </g>

      {/* Daun hijau */}
      <g fill="#A7F3D0">
        <ellipse cx="12" cy="152" rx="10" ry="5" transform="rotate(-35 12 152)" />
        <ellipse cx="30" cy="126" rx="10" ry="5" transform="rotate(-35 30 126)" />
        <ellipse cx="50" cy="90" rx="10" ry="5" transform="rotate(-35 50 90)" />
        <ellipse cx="108" cy="166" rx="10" ry="5" transform="rotate(20 108 166)" />
      </g>
      {/* Daun ungu */}
      <g fill="#DDD6FE">
        <ellipse cx="144" cy="170" rx="10" ry="5" transform="rotate(15 144 170)" />
        <ellipse cx="24" cy="196" rx="9" ry="4.5" transform="rotate(-10 24 196)" />
      </g>

      {/* Bunga besar ungu */}
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="72"
            cy="98"
            rx="7"
            ry="13"
            fill="#C4B5FD"
            transform={`rotate(${a} 72 98) translate(0 -13)`}
          />
        ))}
        <circle cx="72" cy="98" r="8" fill="#F9A8D4" />
      </g>

      {/* Bunga sedang pink */}
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="150"
            cy="176"
            rx="5"
            ry="9"
            fill="#FBCFE8"
            transform={`rotate(${a} 150 176) translate(0 -9)`}
          />
        ))}
        <circle cx="150" cy="176" r="5" fill="#F472B6" />
      </g>

      {/* Bunga kecil ungu muda */}
      <g>
        {[0, 90, 180, 270].map((a) => (
          <circle
            key={a}
            cx="18"
            cy="200"
            r="4"
            fill="#DDD6FE"
            transform={`rotate(${a} 18 200) translate(0 -5)`}
          />
        ))}
        <circle cx="18" cy="200" r="3" fill="#A78BFA" />
      </g>
    </svg>
  )
}
