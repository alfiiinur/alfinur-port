const StarIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#C4F135] mx-2 md:mx-8 flex-shrink-0"
    // Ukuran icon juga kita buat responsif
    style={{
      width: "clamp(40px, 12vw, 80px)",
      height: "clamp(40px, 12vw, 80px)",
    }}
  >
    <path d="M12 2C13.5 7 17 10.5 22 12C17 13.5 13.5 17 12 22C10.5 17 7 13.5 2 12C7 10.5 10.5 7 12 2Z" />
  </svg>
);

// Marquee Content – versi FULLY RESPONSIVE
export const MarqueeContent = () => (
  <div className="flex items-center shrink-0">
    <span
      className="font-black tracking-tighter text-white leading-none whitespace-nowrap"
      style={{
        // Ini kunci utamanya:
        fontSize: "clamp(3.5rem, 14vw, 10rem)", // minimal 56px, maksimal 160px
      }}
    >
      SERVICES
    </span>

    <StarIcon />

    <span
      className="font-black tracking-tighter text-white leading-none whitespace-nowrap"
      style={{
        fontSize: "clamp(3.5rem, 14vw, 10rem)",
      }}
    >
      SERVICES
    </span>

    <StarIcon />
  </div>
);
