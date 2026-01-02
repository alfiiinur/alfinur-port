export type FAQItem = {
  question: { en: string; id: string };
  answer: { en: string; id: string };
};

export type FAQCategoryData = {
  id: string;
  title: { en: string; id: string };
  items: FAQItem[];
};

export const faqData: FAQCategoryData[] = [
  {
    id: "about",
    title: {
      en: "About the brand",
      id: "Tentang brand",
    },
    items: [
      {
        question: {
          en: "What is Beautify and what makes it unique?",
          id: "Apa itu Beautify dan apa yang membuatnya unik?",
        },
        answer: {
          en: "Beautify is a skincare and suncare brand dedicated to transparency, simplicity, and self-love. We create products that feel gentle, perform beautifully, and speak honestly to your skin's needs.",
          id: "Beautify adalah brand skincare dan suncare yang berdedikasi pada transparansi, kesederhanaan, dan cinta diri. Kami menciptakan produk yang terasa lembut, bekerja dengan baik, dan berbicara jujur untuk kebutuhan kulit Anda.",
        },
      },
      {
        question: {
          en: "Where is Beautify based and manufactured?",
          id: "Di mana Beautify berbasis dan diproduksi?",
        },
        answer: {
          en: "We are based in Seoul, South Korea, and all our products are manufactured in GMP-certified facilities.",
          id: "Kami berbasis di Seoul, Korea Selatan, dan semua produk kami diproduksi di fasilitas bersertifikat GMP.",
        },
      },
      {
        question: {
          en: "Who is Beautify for?",
          id: "Untuk siapa Beautify?",
        },
        answer: {
          en: "Our products are designed for everyone, regardless of gender or skin type, focusing on barrier repair and hydration.",
          id: "Produk kami dirancang untuk semua orang, tanpa memandang gender atau jenis kulit, dengan fokus pada perbaikan barrier dan hidrasi.",
        },
      },
    ],
  },
  {
    id: "sustainability",
    title: {
      en: "Sustainability",
      id: "Keberlanjutan",
    },
    items: [
      {
        question: {
          en: "Is Beautify cruelty-free?",
          id: "Apakah Beautify bebas kekejaman?",
        },
        answer: {
          en: "Yes, we are 100% cruelty-free and vegan certified.",
          id: "Ya, kami 100% bebas kekejaman dan bersertifikat vegan.",
        },
      },
      {
        question: {
          en: "Is your packaging sustainable?",
          id: "Apakah kemasan Anda berkelanjutan?",
        },
        answer: {
          en: "We use recycled glass and FSC-certified paper for all our packaging.",
          id: "Kami menggunakan kaca daur ulang dan kertas bersertifikat FSC untuk semua kemasan kami.",
        },
      },
    ],
  },
  {
    id: "ingredients",
    title: {
      en: "Ingredients & safety",
      id: "Bahan & keamanan",
    },
    items: [
      {
        question: {
          en: "Are Beautify products safe for sensitive skin?",
          id: "Apakah produk Beautify aman untuk kulit sensitif?",
        },
        answer: {
          en: "Absolutely. All formulas are dermatologically tested and hypoallergenic.",
          id: "Tentu saja. Semua formula telah diuji secara dermatologis dan hipoalergenik.",
        },
      },
      {
        question: {
          en: "Do your products contain fragrance?",
          id: "Apakah produk Anda mengandung pewangi?",
        },
        answer: {
          en: "No, our entire line is fragrance-free and essential oil-free.",
          id: "Tidak, seluruh lini produk kami bebas pewangi dan bebas minyak esensial.",
        },
      },
    ],
  },
];
