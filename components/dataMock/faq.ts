export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQCategoryData = {
  id: string; // ID unik untuk anchor link (scroll)
  title: string;
  items: FAQItem[];
};

export const faqData: FAQCategoryData[] = [
  {
    id: "about",
    title: "About the brand",
    items: [
      {
        question: "What is Beautify and what makes it unique?",
        answer: "Beautify is a skincare and suncare brand dedicated to transparency, simplicity, and self-love. We create products that feel gentle, perform beautifully, and speak honestly to your skin's needs.",
      },
      {
        question: "Where is Beautify based and manufactured?",
        answer: "We are based in Seoul, South Korea, and all our products are manufactured in GMP-certified facilities.",
      },
      {
        question: "Who is Beautify for?",
        answer: "Our products are designed for everyone, regardless of gender or skin type, focusing on barrier repair and hydration.",
      },
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability",
    items: [
      {
        question: "Is Beautify cruelty-free?",
        answer: "Yes, we are 100% cruelty-free and vegan certified.",
      },
      {
        question: "Is your packaging sustainable?",
        answer: "We use recycled glass and FSC-certified paper for all our packaging.",
      },
    ],
  },
  {
    id: "ingredients",
    title: "Ingredients & safety",
    items: [
      {
        question: "Are Beautify products safe for sensitive skin?",
        answer: "Absolutely. All formulas are dermatologically tested and hypoallergenic.",
      },
      {
        question: "Do your products contain fragrance?",
        answer: "No, our entire line is fragrance-free and essential oil-free.",
      },
    ],
  },
];