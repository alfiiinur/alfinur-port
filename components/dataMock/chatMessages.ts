export interface ChatMessage {
  id: number;
  sender: "user" | "admin";
  message: string;
  timestamp: string;
}

export const dummyChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "admin",
    message:
      "Halo! Selamat datang di Alfi Nur Portfolio. Ada yang bisa saya bantu?",
    timestamp: "10:00",
  },
  {
    id: 2,
    sender: "user",
    message: "Halo, saya ingin bertanya tentang layanan desain web",
    timestamp: "10:01",
  },
  {
    id: 3,
    sender: "admin",
    message:
      "Tentu! Kami menyediakan layanan desain web profesional dengan berbagai paket. Apakah ada kebutuhan spesifik yang Anda cari?",
    timestamp: "10:02",
  },
  {
    id: 4,
    sender: "user",
    message: "Saya butuh website untuk bisnis kecil saya",
    timestamp: "10:03",
  },
  {
    id: 5,
    sender: "admin",
    message:
      "Baik, untuk bisnis kecil kami punya paket starter yang cocok. Termasuk desain responsif, 5 halaman, dan optimasi SEO dasar. Mau saya jelaskan lebih detail?",
    timestamp: "10:04",
  },
];
