import { ServiceItem } from "@/components/public/shared/ServicesItems";
import Image from "next/image";

export const ServicesSection = () => {
  // Data Services (Mudah ditambah/dikurangi)
  const servicesData = [
    {
      title: "Space Planning",
      desc: "We create efficient layouts to maximize the use of space. Every design is crafted with attention to detail to ensure comfort and ease of use.",
    },
    {
      title: "Interior Design",
      desc: "From concept development to final installation, we handle all aspects of interior decoration, ensuring every detail aligns with the client's vision.",
    },
    {
      title: "Custom Furniture Design",
      desc: "We design and craft unique furniture pieces tailored to specific client needs, creating items that are not only beautiful but also functional.",
    },
    {
      title: "Project Management",
      desc: "We oversee the entire design process, ensuring projects are completed on time and within budget.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* KIRI: Judul & Gambar Besar */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-5xl font-black mb-6 text-black dark:text-white">
              Our Services
            </h2>
            <p className="text-sm text-black dark:text-white max-w-md">
              At Britto Charette, we offer a comprehensive range of services to
              bring your interior design vision to life. Each service is
              tailored to meet the unique needs of our clients.
            </p>
          </div>

          <div className="relative w-full h-[400px] lg:h-[600px] rounded-tl-[4rem] rounded-br-[4rem] overflow-hidden">
            <Image
              src="/img/room.jpg"
              alt="Services Interior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* KANAN: List Services (Menggunakan Reusable Component) */}
        <div className="flex flex-col justify-center pt-10 lg:pt-0">
          {servicesData.map((service, index) => (
            <ServiceItem
              key={index}
              title={service.title}
              description={service.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
