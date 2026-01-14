"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    home: "Home",
    about: "About",
    projects: "Projects",
    blog: "Blog",
    design: "Design",
    services: "Services",
    contact: "Contact",
    designGrid: "Design Grid",
    designShowcase: "Design Showcase",
    search: "Search",
    toggleTheme: "Toggle Theme",
    downloadCV: "Download CV",
    searchPlaceholder: "Search pages or actions...",
    navigation: "Navigation",
    actions: "Actions",
    noResults: "No results found.",
    clickToCopy: "Click to copy",
    copied: "Copied!",
    switchLanguage: "Switch Language",

    // Common
    seeMore: "See More",
    loadMore: "Load More",
    viewAll: "View All",
    readMore: "Read More",
    learnMore: "Learn More",
    getStarted: "Get Started",
    contactMe: "Contact Me",
    letsStart: "Let's Start",
    learnMoreAboutMe: "Learn More About Me",
    seeMoreOnGithub: "See More on GitHub",
    remaining: "remaining",

    // Home - Header
    halloEveryone: "HALLO EVERYONE",
    imAlfiNur: "I'm Alfi Nur Danialin",
    basedIn: "based in",
    indonesia: "Indonesia",
    welcomePortfolio: "Welcome to my portfolio website!",
    passionateAbout:
      "I'm passionate about crafting innovative and efficient IT solutions that drive success.",
    exploreProjects:
      "Explore my projects, skills, and experiences as you get to know more about my journey in the tech world.",

    // Home - Process
    myApproach: "(My Approach)",
    welcomeToPortfolio: "Welcome to my portfolio where I",
    showcaseJourney: "showcase my journey as a",
    turningIdeas: "turning ideas into digital solutions",
    realImpact: "that make a real impact.",
    fromWebDev: "From web development to system design,",
    bringCreativity: "I bring creativity and technical expertise together.",
    exploreMyProjects: "Explore my projects, skills, and experiences",
    buildTogether: "as we build something amazing together.",

    // Roles
    itDeveloper: "IT Developer",
    webDeveloper: "Web Developer",
    uiuxDesigner: "UI/UX Designer",
    frontendDev: "Frontend Dev",
    graphicDesigner: "Graphic Designer",
    itInfrastructure: "IT Infrastructure",

    // About
    aboutMe: "About Me",
    myStory: "My Story",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    workNow: "WORK NOW",
    workHistory: "Work History",
    techStack: "Tech Stack",
    keyTasks: "Key Tasks",
    iAmItDeveloper:
      "I am an IT Developer based in Indonesia, passionate about creating innovative and efficient IT solutions that drive success.",
    myProfessionalJourney:
      "My professional journey through various roles in technology and development.",
    alfiNurBio:
      "Hi, I'm Alfi Nur Danialin, a graduate of Informatics Engineering with expertise in Front-End Developer Designer. I'm a creative and multi-skilled Front-End Developer with a unique blend of technical development and visual design skills. Armed with a foundation of React.js, and Tailwind CSS, I build responsive and userfriendly interfaces. My design skills are honed through years of experience creating branding assets, digital content, and UI mockups using Figma, Adobe Photoshop, and Canva. Passionate about delivering visually appealing and highly functional user experiences, I thrive in collaborative environments that blend creativity and precision. Furthermore, I have excellent communication skills and can work in a team, balancing positioning and prioritizing",
    getInTouchBtn: "Get in Touch",
    richHeadingBadge: "About Me",
    richHeadingDescription:
      "I'm a passionate IT Developer from Indonesia, dedicated to creating innovative digital solutions that combine creativity with technical excellence.",
    richHeadingCreative: "creative",
    richHeadingPassionate: "passionate",
    richHeadingInnovative: "innovative",
    richHeadingDedicated: "dedicated",
    richHeadingDeveloper: "developer",
    richHeadingPassionateAbout: "passionate about building",
    richHeadingModernWeb: "modern web applications with cutting-edge",
    richHeadingTechnologies: "technologies.",
    missionLabel: "My Mission",
    missionBadge: "Vision & Mission",
    missionTitle: "Building Digital Excellence Through Innovation",
    missionDescription:
      "I believe in creating meaningful digital experiences that not only look beautiful but also solve real problems. My approach combines technical expertise with creative thinking to deliver solutions that make a difference.",

    // Projects
    myProjects: "My Projects",
    allProjects: "All Projects",
    featuredProjects: "Featured Projects",
    viewProject: "View Project",

    // Services
    myServices: "My Services",
    whatIOffer: "What I Offer",
    whatICanDo: "What I Can Do",
    forYou: "For You",
    professionalServices: "Professional IT services tailored to your needs.",
    fromWebDesign:
      "From web design to consulting, I deliver quality solutions with a proven process.",

    // Contact
    getInTouch: "Get In Touch",
    sendMessage: "Send Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    studio: "Studio",
    generalEnquiries: "General Enquiries",
    follow: "Follow",
    creativeDevDesigner:
      "Creative Developer & Designer — Passionate about crafting digital experiences that blend aesthetics with functionality. From web applications to brand identities, every project is an opportunity to create something meaningful and impactful.",

    // Blog
    latestPosts: "Latest Posts",
    allPosts: "All Posts",
    readArticle: "Read Article",
    minRead: "min read",
    publishedOn: "Published on",
    categories: "Categories",
    tags: "Tags",
    relatedPosts: "Related Posts",
    comments: "Comments",
    leaveComment: "Leave a Comment",
    yourComment: "Your Comment",
    submit: "Submit",

    // GitHub
    openSourceContributions: "Open Source & Contributions",
    loveBuildingPublic:
      "I love building in public. Here are some of my favorite projects.",

    // Footer
    allRightsReserved: "All Rights Reserved",
    madeWith: "Made with",
    by: "by",

    // Newsletter
    stayUpdated: "Stay Updated",
    subscribeNewsletter:
      "Subscribe to my newsletter for the latest updates and insights.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",

    // Testimonials
    testimonials: "Testimonials",
    whatClientsSay: "What Clients Say",

    // FAQ
    faq: "FAQ",
    frequentlyAsked: "Frequently Asked Questions",

    // Design
    designPortfolio: "Design Portfolio",
    creativeWorks: "Creative Works",
    viewDesign: "View Design",
    findDesignInspiration: "Find Design Inspiration Here",
    exploreOurWork:
      "Explore our work here and find talented and experienced designers ready to work on your next project.",
    shots: "Shots",
    designers: "Designers",
    whatTypeDesign: "What type of design are you interested in?",
    popular: "Popular",
    dashboard: "dashboard",
    landingPage: "landing page",
    ecommerce: "e-commerce",
    logo: "logo",
    mobileApp: "mobile app",
    getMatchedNow: "Get Matched Now",
    tellUsWhatYouNeed:
      "Tell us what you need and instantly get matched with world-class talent ready to work on your project.",

    // Achievements
    achievements: "Achievements",
    awards: "Awards",
    certifications: "Certifications",
    statistics: "Statistics",
    numbersThatSpeak: "Numbers that speak for itself",
    statisticsDescription:
      "These statistics reflect my dedication to delivering quality work and building lasting relationships with clients across various projects.",
    technicalExpertise: "Technical Expertise",
    skillsTitle: "Skills",

    // Gallery Section
    seeSocial: "See Social",
    ourSocial: "OUR",
    socialText: "SOCIAL",
    subscribeDescription:
      "Subscribe to our newsletter and receive more information about our world and products.",
    subscribePlaceholder: "SUBSCRIBE",
    menu: "Menu",
    work: "Work",
    followUs: "Follow Us",
  },
  id: {
    // Navbar
    home: "Beranda",
    about: "Tentang",
    projects: "Proyek",
    blog: "Blog",
    design: "Desain",
    services: "Layanan",
    contact: "Kontak",
    designGrid: "Grid Desain",
    designShowcase: "Showcase Desain",
    search: "Cari",
    toggleTheme: "Ganti Tema",
    downloadCV: "Unduh CV",
    searchPlaceholder: "Cari halaman atau aksi...",
    navigation: "Navigasi",
    actions: "Aksi",
    noResults: "Tidak ada hasil.",
    clickToCopy: "Klik untuk salin",
    copied: "Tersalin!",
    switchLanguage: "Ganti Bahasa",

    // Common
    seeMore: "Lihat Lebih",
    loadMore: "Muat Lebih",
    viewAll: "Lihat Semua",
    readMore: "Baca Selengkapnya",
    learnMore: "Pelajari Lebih",
    getStarted: "Mulai Sekarang",
    contactMe: "Hubungi Saya",
    letsStart: "Ayo Mulai",
    learnMoreAboutMe: "Pelajari Lebih Tentang Saya",
    seeMoreOnGithub: "Lihat Lebih di GitHub",
    remaining: "tersisa",

    // Home - Header
    halloEveryone: "HALO SEMUANYA",
    imAlfiNur: "Saya Alfi Nur Danialin",
    basedIn: "berbasis di",
    indonesia: "Indonesia",
    welcomePortfolio: "Selamat datang di website portfolio saya!",
    passionateAbout:
      "Saya bersemangat dalam menciptakan solusi IT yang inovatif dan efisien untuk kesuksesan.",
    exploreProjects:
      "Jelajahi proyek, keahlian, dan pengalaman saya saat Anda mengenal lebih jauh perjalanan saya di dunia teknologi.",

    // Home - Process
    myApproach: "(Pendekatan Saya)",
    welcomeToPortfolio: "Selamat datang di portfolio saya dimana saya",
    showcaseJourney: "menampilkan perjalanan saya sebagai",
    turningIdeas: "mengubah ide menjadi solusi digital",
    realImpact: "yang memberikan dampak nyata.",
    fromWebDev: "Dari pengembangan web hingga desain sistem,",
    bringCreativity: "Saya menggabungkan kreativitas dan keahlian teknis.",
    exploreMyProjects: "Jelajahi proyek, keahlian, dan pengalaman saya",
    buildTogether: "saat kita membangun sesuatu yang luar biasa bersama.",

    // Roles
    itDeveloper: "Developer IT",
    webDeveloper: "Developer Web",
    uiuxDesigner: "Desainer UI/UX",
    frontendDev: "Dev Frontend",
    graphicDesigner: "Desainer Grafis",
    itInfrastructure: "Infrastruktur IT",

    // About
    aboutMe: "Tentang Saya",
    myStory: "Cerita Saya",
    experience: "Pengalaman",
    skills: "Keahlian",
    education: "Pendidikan",
    workNow: "PEKERJAAN SEKARANG",
    workHistory: "Riwayat Kerja",
    techStack: "Tech Stack",
    keyTasks: "Tugas Utama",
    iAmItDeveloper:
      "Saya adalah Developer IT berbasis di Indonesia, bersemangat dalam menciptakan solusi IT yang inovatif dan efisien untuk kesuksesan.",
    myProfessionalJourney:
      "Perjalanan profesional saya melalui berbagai peran di teknologi dan pengembangan.",
    alfiNurBio:
      "Hai, saya Alfi Nur Danialin, lulusan Teknik Informatika dengan keahlian sebagai Desainer Pengembang Front-End. Saya seorang Pengembang Front-End yang kreatif dan multi-terampil dengan perpaduan unik antara pengembangan teknis dan keterampilan desain visual. Berbekal dasar React.js dan Tailwind CSS, saya membangun antarmuka yang responsif dan ramah pengguna. Keterampilan desain saya diasah melalui pengalaman bertahun-tahun dalam membuat aset branding, konten digital, dan mockup UI menggunakan Figma, Adobe Photoshop, dan Canva. Saya bersemangat untuk menghadirkan pengalaman pengguna yang menarik secara visual dan sangat fungsional, dan saya berkembang dalam lingkungan kolaboratif yang memadukan kreativitas dan ketelitian. Selain itu, saya memiliki keterampilan komunikasi yang sangat baik dan dapat bekerja dalam tim, menyeimbangkan pen positioning dan prioritas.",
    getInTouchBtn: "Hubungi Saya",
    richHeadingBadge: "Tentang Saya",
    richHeadingDescription:
      "Saya adalah Developer IT yang bersemangat dari Indonesia, berdedikasi untuk menciptakan solusi digital inovatif yang menggabungkan kreativitas dengan keunggulan teknis.",
    richHeadingCreative: "kreatif",
    richHeadingPassionate: "bersemangat",
    richHeadingInnovative: "inovatif",
    richHeadingDedicated: "berdedikasi",
    richHeadingDeveloper: "developer",
    richHeadingPassionateAbout: "bersemangat membangun",
    richHeadingModernWeb: "aplikasi web modern dengan teknologi",
    richHeadingTechnologies: "terkini.",
    missionLabel: "Misi Saya",
    missionBadge: "Visi & Misi",
    missionTitle: "Membangun Keunggulan Digital Melalui Inovasi",
    missionDescription:
      "Saya percaya dalam menciptakan pengalaman digital yang bermakna yang tidak hanya terlihat indah tetapi juga memecahkan masalah nyata. Pendekatan saya menggabungkan keahlian teknis dengan pemikiran kreatif untuk memberikan solusi yang membuat perbedaan.",

    // Projects
    myProjects: "Proyek Saya",
    allProjects: "Semua Proyek",
    featuredProjects: "Proyek Unggulan",
    viewProject: "Lihat Proyek",

    // Services
    myServices: "Layanan Saya",
    whatIOffer: "Yang Saya Tawarkan",
    whatICanDo: "Yang Bisa Saya Lakukan",
    forYou: "Untuk Anda",
    professionalServices:
      "Layanan IT profesional yang disesuaikan dengan kebutuhan Anda.",
    fromWebDesign:
      "Dari desain web hingga konsultasi, saya memberikan solusi berkualitas dengan proses yang terbukti.",

    // Contact
    getInTouch: "Hubungi Kami",
    sendMessage: "Kirim Pesan",
    yourName: "Nama Anda",
    yourEmail: "Email Anda",
    yourMessage: "Pesan Anda",
    studio: "Studio",
    generalEnquiries: "Pertanyaan Umum",
    follow: "Ikuti",
    creativeDevDesigner:
      "Developer & Desainer Kreatif — Bersemangat dalam menciptakan pengalaman digital yang memadukan estetika dengan fungsionalitas. Dari aplikasi web hingga identitas merek, setiap proyek adalah kesempatan untuk menciptakan sesuatu yang bermakna dan berdampak.",

    // Blog
    latestPosts: "Postingan Terbaru",
    allPosts: "Semua Postingan",
    readArticle: "Baca Artikel",
    minRead: "menit baca",
    publishedOn: "Dipublikasikan pada",
    categories: "Kategori",
    tags: "Tag",
    relatedPosts: "Postingan Terkait",
    comments: "Komentar",
    leaveComment: "Tinggalkan Komentar",
    yourComment: "Komentar Anda",
    submit: "Kirim",

    // GitHub
    openSourceContributions: "Open Source & Kontribusi",
    loveBuildingPublic:
      "Saya suka membangun secara publik. Berikut beberapa proyek favorit saya.",

    // Footer
    allRightsReserved: "Hak Cipta Dilindungi",
    madeWith: "Dibuat dengan",
    by: "oleh",

    // Newsletter
    stayUpdated: "Tetap Update",
    subscribeNewsletter:
      "Berlangganan newsletter saya untuk update dan insight terbaru.",
    enterEmail: "Masukkan email Anda",
    subscribe: "Berlangganan",

    // Testimonials
    testimonials: "Testimoni",
    whatClientsSay: "Apa Kata Klien",

    // FAQ
    faq: "FAQ",
    frequentlyAsked: "Pertanyaan yang Sering Diajukan",

    // Design
    designPortfolio: "Portfolio Desain",
    creativeWorks: "Karya Kreatif",
    viewDesign: "Lihat Desain",
    findDesignInspiration: "Temukan Inspirasi Desain Disini",
    exploreOurWork:
      "Jelajahi karya kami disini dan temukan desainer berbakat dan berpengalaman yang siap mengerjakan proyek Anda selanjutnya.",
    shots: "Karya",
    designers: "Desainer",
    whatTypeDesign: "Jenis desain apa yang Anda minati?",
    popular: "Populer",
    dashboard: "dashboard",
    landingPage: "landing page",
    ecommerce: "e-commerce",
    logo: "logo",
    mobileApp: "aplikasi mobile",
    getMatchedNow: "Dapatkan Kecocokan Sekarang",
    tellUsWhatYouNeed:
      "Beritahu kami apa yang Anda butuhkan dan langsung dapatkan kecocokan dengan talenta kelas dunia yang siap mengerjakan proyek Anda.",

    // Achievements
    achievements: "Pencapaian",
    awards: "Penghargaan",
    certifications: "Sertifikasi",
    statistics: "Statistik",
    numbersThatSpeak: "Angka yang berbicara sendiri",
    statisticsDescription:
      "Statistik ini mencerminkan dedikasi saya dalam memberikan pekerjaan berkualitas dan membangun hubungan jangka panjang dengan klien di berbagai proyek.",
    technicalExpertise: "Keahlian Teknis",
    skillsTitle: "Keahlian",

    // Gallery Section
    seeSocial: "Lihat Sosial",
    ourSocial: "SOSIAL",
    socialText: "KAMI",
    subscribeDescription:
      "Berlangganan newsletter kami dan dapatkan informasi lebih lanjut tentang dunia dan produk kami.",
    subscribePlaceholder: "BERLANGGANAN",
    menu: "Menu",
    work: "Karya",
    followUs: "Ikuti Kami",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "id")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
