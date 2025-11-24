interface ServiceItemProps {
  title: string;
  description: string;
}

export const ServiceItem = ({ title, description }: ServiceItemProps) => {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <h3 className="text-xl font-bold uppercase tracking-wider text-black">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-md">
        {description}
      </p>
    </div>
  );
};
