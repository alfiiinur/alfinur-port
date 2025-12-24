import {
  AwardData,
  TestimonialData,
} from "@/app/(public)/about/sections_about/achievements/types";

export const awards: AwardData[] = [
  {
    id: 1,
    name: "Recipients of the PKM-AI Incentive Scheme 2025",
    description:
      "Served as Research Team Leader responsible for the planning, implementation, and coordination of the project across all design and technical aspects. Research entitled  `Penerapan Metode Agile Scrum dan Pengujian  System Usability Scale untuk Pengembangan Media Pembelajaran Sistem Rekomendasi Pemodelan User Based dan Item-Based`",
    year: "2025",
    certificateUrl: "/frontend/sertifikat/PKM-AI_ALFI NUR.pdf",
    popupImages: [
      "/img-alfinur/1733886020011.jpg",
      "/img-alfinur/1733886019938.jpg",
      "/img-alfinur/Screenshot 2025-12-24 125821.png",
    ],
  },
  {
    id: 2,
    name: "Passed the CENIM 2025 international conference",
    description:
      "I am thrilled to announce that my research paper has been accepted for presentation at the 2025 International Conference on Computer Engineering, Network, and Intelligent Multimedia (CENIM), hosted by Institut Teknologi Sepuluh Nopember (ITS)",
    year: "2025",
    certificateUrl: "/frontend/sertifikat/Alfi Nur Danialin-CENIM.pdf",
    popupImages: [
      "/img-alfinur/WhatsApp Image 2025-11-26 at 12.12.58.jpeg",
      "/img-alfinur/WhatsApp Image 2025-11-26 at 11.55.44 (1).jpeg",
      "/img-alfinur/WhatsApp Image 2025-11-26 at 13.41.31.jpeg",
    ],
  },
  {
    id: 3,
    name: "BNSP Young Computer Network Technician Competency Certification",
    description: "Get network certification that is updated by BNSP",
    year: "2023",
    certificateUrl: "/frontend/sertifikat/AlfiNur Danialin-Jaringan.pdf",
    popupImages: [
      "/img-alfinur/IMG_2280.JPG",
      "/img-alfinur/IMG_2556.JPG",
      "/img-alfinur/IMG_4762.jpg",
    ],
  },
  // ...
];

export const testimonials: TestimonialData[] = [
  {
    id: 1,
    quote: "Working with this team increased our conversion rate dramatically.",
    authorName: "Sarah Chen",
    authorRole: "CMO at TechCorp",
    authorImage: "/img/room.jpg",
    isHighlight: true,
    highlightStat: "8X",
    highlightText: "Increase in conversion rate",
  },
  {
    id: 2,
    quote: "The best creative partner we've ever had. Period.",
    authorName: "Michael Rivera",
    authorRole: "CEO at StartupX",
    authorImage: "/img/room.jpg",
  },
  // ...
];
