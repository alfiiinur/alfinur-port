// Data list service dengan detail
export interface ServiceItem {
  id: number;
  name: string;
  nameId: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  image: string;
  label: string;
}

export const services: string[] = [
  "Logo Design",
  "Visual Refreshment",
  "Brand Guidelines",
  "Infographic Design",
  "Brand Implementation",
  "Social Media Design",
  "Stationary Design",
  "Print Design",
  "Pitch Deck Design",
];

export const servicesId: string[] = [
  "Desain Logo",
  "Penyegaran Visual",
  "Panduan Brand",
  "Desain Infografis",
  "Implementasi Brand",
  "Desain Media Sosial",
  "Desain Alat Tulis",
  "Desain Cetak",
  "Desain Pitch Deck",
];

export const serviceDetails: ServiceItem[] = [
  {
    id: 1,
    name: "Logo Design",
    nameId: "Desain Logo",
    title: "Logo\nDesign",
    titleId: "Desain\nLogo",
    description:
      "We craft memorable logos that capture your brand essence and create lasting impressions across all touchpoints.",
    descriptionId:
      "Kami membuat logo yang berkesan yang menangkap esensi brand Anda dan menciptakan kesan abadi di semua titik kontak.",
    image: "/img/room.jpg",
    label: "LOGO",
  },
  {
    id: 2,
    name: "Visual Refreshment",
    nameId: "Penyegaran Visual",
    title: "Visual\nRefreshment",
    titleId: "Penyegaran\nVisual",
    description:
      "Revitalize your existing brand with modern updates while maintaining the core identity your audience knows.",
    descriptionId:
      "Revitalisasi brand Anda dengan pembaruan modern sambil mempertahankan identitas inti yang dikenal audiens Anda.",
    image: "/img/room.jpg",
    label: "VISUAL",
  },
  {
    id: 3,
    name: "Brand Guidelines",
    nameId: "Panduan Brand",
    title: "Brand\nGuidelines",
    titleId: "Panduan\nBrand",
    description:
      "Comprehensive brand books that ensure consistency across all channels and team members.",
    descriptionId:
      "Buku panduan brand komprehensif yang memastikan konsistensi di semua saluran dan anggota tim.",
    image: "/img/room.jpg",
    label: "BRAND",
  },
  {
    id: 4,
    name: "Infographic Design",
    nameId: "Desain Infografis",
    title: "Infographic\nDesign",
    titleId: "Desain\nInfografis",
    description:
      "Transform complex data into visually compelling stories that engage and inform your audience.",
    descriptionId:
      "Ubah data kompleks menjadi cerita visual yang menarik yang melibatkan dan menginformasikan audiens Anda.",
    image: "/img/room.jpg",
    label: "INFOGRAPHIC",
  },
  {
    id: 5,
    name: "Brand Implementation",
    nameId: "Implementasi Brand",
    title: "Brand\nImplementation",
    titleId: "Implementasi\nBrand",
    description:
      "Seamless rollout of your brand identity across all platforms, materials, and touchpoints.",
    descriptionId:
      "Peluncuran identitas brand Anda secara mulus di semua platform, materi, dan titik kontak.",
    image: "/img/room.jpg",
    label: "IMPLEMENT",
  },
  {
    id: 6,
    name: "Social Media Design",
    nameId: "Desain Media Sosial",
    title: "Social Media\nDesign",
    titleId: "Desain\nMedia Sosial",
    description:
      "Scroll-stopping social content that builds engagement and strengthens your online presence.",
    descriptionId:
      "Konten sosial yang menarik perhatian yang membangun engagement dan memperkuat kehadiran online Anda.",
    image: "/img/room.jpg",
    label: "SOCIAL",
  },
  {
    id: 7,
    name: "Stationary Design",
    nameId: "Desain Alat Tulis",
    title: "Stationary\nDesign",
    titleId: "Desain\nAlat Tulis",
    description:
      "Professional business cards, letterheads, and corporate materials that leave lasting impressions.",
    descriptionId:
      "Kartu nama profesional, kop surat, dan materi korporat yang meninggalkan kesan abadi.",
    image: "/img/room.jpg",
    label: "STATIONARY",
  },
  {
    id: 8,
    name: "Print Design",
    nameId: "Desain Cetak",
    title: "Print\nDesign",
    titleId: "Desain\nCetak",
    description:
      "High-impact print materials from brochures to packaging that communicate your brand story.",
    descriptionId:
      "Materi cetak berdampak tinggi dari brosur hingga kemasan yang mengkomunikasikan cerita brand Anda.",
    image: "/img/room.jpg",
    label: "PRINT",
  },
  {
    id: 9,
    name: "Pitch Deck Design",
    nameId: "Desain Pitch Deck",
    title: "Pitch Deck\nDesign",
    titleId: "Desain\nPitch Deck",
    description:
      "Persuasive presentation designs that help you win clients, investors, and opportunities.",
    descriptionId:
      "Desain presentasi persuasif yang membantu Anda memenangkan klien, investor, dan peluang.",
    image: "/img/room.jpg",
    label: "PITCH",
  },
];

// Default content
export const defaultServiceContent = {
  id: 0,
  title: "Graphic &\nBranding\nDesign",
  titleId: "Desain\nGrafis &\nBranding",
  description:
    "We design cohesive visual identities—from logos to brand systems—that scale with your business.",
  descriptionId:
    "Kami mendesain identitas visual yang kohesif—dari logo hingga sistem brand—yang berkembang bersama bisnis Anda.",
  image: "/frontend/webImg/26.png",
  label: "CELERO",
};
