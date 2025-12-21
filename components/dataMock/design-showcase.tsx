// data.ts
export interface ShowcaseItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  badgeColor: string; // Tailwind class
  accentColor: string; // Hex for background effects
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: "Copilot",
    subtitle: "JANUARY",
    description:
      "Copilot in Edge helped millions of people create quizzes, podcasts, images, and more via chat and voice.",
    image: "/img/room.png", // Ganti dengan gambar Anda
    badge: "JANUARY",
    badgeColor: "bg-rose-500",
    accentColor: "#f43f5e",
  },
  {
    id: 2,
    title: "Translation",
    subtitle: "FEBRUARY",
    description:
      "Edge helped people consume content across the world in their preferred language translating nearly 70 trillion words.",
    image: "/img/room.png",
    badge: "FEBRUARY",
    badgeColor: "bg-blue-500",
    accentColor: "#3b82f6",
  },
  {
    id: 3,
    title: "Video Summary",
    subtitle: "MARCH",
    description:
      "In March, we launched video summaries to make content easier to digest quickly and efficiently.",
    image: "/img/room.png",
    badge: "MARCH",
    badgeColor: "bg-emerald-500",
    accentColor: "#10b981",
  },
  {
    id: 4,
    title: "Gaming",
    subtitle: "APRIL",
    description:
      "Experience the best of cloud gaming directly in your browser with optimized performance.",
    image: "/img/room.png",
    badge: "APRIL",
    badgeColor: "bg-purple-500",
    accentColor: "#8b5cf6",
  },
];

// Posisi acak untuk efek "Awan" di halaman depan
export const floatingImages = [
  { src: "/img/room.png", top: "5%", left: "5%", rotate: -12, scale: 0.8 },
  { src: "/img/room.png", top: "10%", left: "25%", rotate: 5, scale: 0.6 },
  { src: "/img/room.png", top: "15%", right: "10%", rotate: 8, scale: 0.7 },
  { src: "/img/room.png", top: "40%", left: "5%", rotate: -8, scale: 0.5 },
  { src: "/img/room.png", top: "60%", right: "5%", rotate: 12, scale: 0.8 },
  { src: "/img/room.png", bottom: "10%", left: "15%", rotate: -5, scale: 0.6 },
  { src: "/img/room.png", bottom: "5%", right: "20%", rotate: 10, scale: 0.7 },
];
