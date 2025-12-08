interface TextHeadingBottomProps {
  text: string;
  className?: string;
}

export const TextHeadingBottom = ({
  text,
  className,
}: TextHeadingBottomProps) => {
  return (
    <>
      <div className="w-full mt-10 md:mt-0 leading-[0.75]">
        <h1
          className={`text-[18vw] text-white text-center tracking-tight select-none ${className}`}
        >
          {text}
        </h1>
      </div>
    </>
  );
};
