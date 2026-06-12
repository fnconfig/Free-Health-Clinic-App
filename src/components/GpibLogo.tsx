import React from "react";

interface GpibLogoProps {
  className?: string;
  size?: number;
}

export const GpibLogo: React.FC<GpibLogoProps> = ({ className, size = 100 }) => {
  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definitions for Text Paths */}
      <defs>
        {/* Top Text Path: Clockwise upper semi-circle */}
        <path
          id="gpib-text-path-top"
          d="M 38,200 A 162,162 0 1,1 362,200"
          fill="none"
        />
        {/* Bottom Text Path: Counter-clockwise lower semi-circle so letters are upright */}
        <path
          id="gpib-text-path-bottom"
          d="M 60,200 A 140,140 0 0,0 340,200"
          fill="none"
        />
      </defs>

      {/* Outer Circle (Thick Ring) */}
      <circle cx="200" cy="200" r="185" stroke="#2F3F8E" strokeWidth="6.5" fill="white" />
      
      {/* Inner Thin Circle Ring */}
      <circle cx="200" cy="200" r="150" stroke="#2F3F8E" strokeWidth="2.5" fill="none" />

      {/* Top Text */}
      <text fill="#2F3F8E" fontSize="12" fontWeight="800" letterSpacing="0.8">
        <textPath href="#gpib-text-path-top" startOffset="50%" textAnchor="middle">
          GEREJA PROTESTAN di INDONESIA bagian BARAT
        </textPath>
      </text>

      {/* Bottom Text */}
      <text fill="#2F3F8E" fontSize="32" fontWeight="950" letterSpacing="10">
        <textPath href="#gpib-text-path-bottom" startOffset="50%" textAnchor="middle">
          GPIB
        </textPath>
      </text>

      {/* Separating Stars */}
      <text x="44" y="206" fill="#2F3F8E" fontSize="16" textAnchor="middle">★</text>
      <text x="356" y="206" fill="#2F3F8E" fontSize="16" textAnchor="middle">★</text>

      {/* Inner Central Emblem Ring */}
      <circle cx="200" cy="200" r="142" stroke="#2F3F8E" strokeWidth="1.5" fill="none" />

      {/* BACKGROUND SCENERY */}
      {/* Clouds at top */}
      <path
        d="M 170,80 C 160,80 155,70 165,65 C 160,55 175,50 185,57 C 195,48 215,53 210,65 C 220,70 210,80 200,80 Z"
        fill="none"
        stroke="#2F3F8E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Sun rays from clouds */}
      <line x1="185" y1="78" x2="160" y2="105" stroke="#2F3F8E" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="200" y1="80" x2="200" y2="110" stroke="#2F3F8E" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="215" y1="78" x2="240" y2="105" stroke="#2F3F8E" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* City outline on left */}
      <path
        d="M 65,220 L 65,200 L 75,200 L 75,215 L 80,215 L 80,192 L 92,192 L 92,210 L 100,210 L 100,197 L 110,197 L 110,215 L 122,215 L 122,205 L 132,205 L 132,225"
        stroke="#2F3F8E"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Mountain outline on right */}
      <path
        d="M 235,225 L 265,182 L 295,210 L 335,218"
        stroke="#2F3F8E"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 255,225 L 285,168 L 325,220"
        stroke="#2F3F8E"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* PRAYING CROWDS OF PEOPLE (Arches representing people standing) */}
      <g opacity="0.9">
        {/* Left crowd row 1 (back) */}
        <path d="M 70,250 C 70,240 80,240 80,250 C 80,240 90,240 90,250 C 90,240 100,240 100,250 C 100,240 110,240 110,250" fill="none" stroke="#2F3F8E" strokeWidth="2" />
        {/* Left crowd row 2 */}
        <path d="M 65,265 C 65,253 77,253 77,265 C 77,253 89,253 89,265 C 89,253 101,253 101,265 L 101,280 L 65,280 Z" fill="white" stroke="#2F3F8E" strokeWidth="2" />
        {/* Left crowd row 3 (front) */}
        <path d="M 72,280 C 72,268 86,268 86,280 C 86,268 100,268 100,280 L 100,300 L 72,300 Z" fill="white" stroke="#2F3F8E" strokeWidth="2" />
        {/* Kneeling/praying details left */}
        <circle cx="86" cy="274" r="5" fill="#2F3F8E" />
        <circle cx="73" cy="259" r="4.5" fill="#2F3F8E" />
        <circle cx="85" cy="244" r="4" fill="#2F3F8E" />
      </g>

      <g opacity="0.9">
        {/* Right crowd row 1 (back) */}
        <path d="M 290,250 C 290,240 300,240 300,250 C 300,240 310,240 310,250 C 310,240 320,240 320,250" fill="none" stroke="#2F3F8E" strokeWidth="2" />
        {/* Right crowd row 2 */}
        <path d="M 295,265 C 295,253 307,253 307,265 C 307,253 319,253 319,265 C 319,253 331,253 331,265 L 331,280 L 295,280 Z" fill="white" stroke="#2F3F8E" strokeWidth="2" />
        {/* Right crowd row 3 (front) */}
        <path d="M 298,280 C 298,268 312,268 312,280 C 312,268 326,268 326,280 L 326,300 L 298,300 Z" fill="white" stroke="#2F3F8E" strokeWidth="2" />
        {/* Kneeling/praying details right */}
        <circle cx="312" cy="274" r="5" fill="#2F3F8E" />
        <circle cx="325" cy="259" r="4.5" fill="#2F3F8E" />
        <circle cx="295" cy="244" r="4" fill="#2F3F8E" />
      </g>

      {/* CHRISTIAN CROSS IN THE CENTER */}
      {/* Rested on open Bible */}
      <path
        d="M 186,105 L 214,105 L 214,135 L 250,135 L 250,161 L 214,161 L 214,242 L 186,242 L 186,161 L 150,161 L 150,135 L 186,135 Z"
        fill="white"
        stroke="#2F3F8E"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* OPEN BIBLE / BOOK */}
      <g>
        {/* Left page */}
        <path
          d="M 200,242 C 185,232 145,232 110,248 L 110,298 C 145,282 185,282 200,292 Z"
          fill="white"
          stroke="#2F3F8E"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Right page */}
        <path
          d="M 200,242 C 215,232 255,232 290,248 L 290,298 C 255,282 215,282 200,292 Z"
          fill="white"
          stroke="#2F3F8E"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Text on pages: LUKAS on left, 13:29 on right */}
        <text x="155" y="272" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2F3F8E">
          LUKAS
        </text>
        <text x="245" y="272" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2F3F8E">
          13:29
        </text>
      </g>

      {/* SACRAMENTAL ELEMENTS UNDER THE BIBLE (Bread and Communion Chalice/Cup) */}
      {/* Loaf of Bread (Left side) */}
      <path
        d="M 160,323 C 160,311 205,311 208,323 C 208,333 160,333 160,323 Z"
        fill="white"
        stroke="#2F3F8E"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M 172,315 L 177,326" stroke="#2F3F8E" strokeWidth="2" strokeLinecap="round" />
      <path d="M 184,315 L 189,326" stroke="#2F3F8E" strokeWidth="2" strokeLinecap="round" />
      <path d="M 196,315 L 201,326" stroke="#2F3F8E" strokeWidth="2" strokeLinecap="round" />

      {/* Communion Chalice / Cup (Right side) */}
      <path
        d="M 226,303 L 252,303 M 226,303 C 226,324 239,326 239,334 L 239,343 L 239,347 L 232,347 L 246,347 L 246,343 L 239,343"
        fill="white"
        stroke="#2F3F8E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
