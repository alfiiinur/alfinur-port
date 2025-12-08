export const NewsLater = () => {
  return (
    <>
      {/* Newsletter */}
      <div className="w-full max-w-md mx-auto bg-muted rounded-2xl p-6 sm:p-8 ">
        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Join the <span className="italic">newsletter</span>
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
          All the latest news and updates from homepoint
        </p>

        {/* Form */}
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email address"
            required
            className="flex-1 px-5 py-3.5 rounded-xl bg-background border border-border 
                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                 placeholder:text-muted-foreground/60
                 text-foreground text-base
                 transition-all duration-200"
          />

          <button
            type="submit"
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold
                 hover:bg-primary/90 active:scale-95
                 transition-all duration-200
                 whitespace-nowrap
                 shadow-md hover:shadow-lg"
          >
            Subscribe
          </button>
        </form>

        {/* Optional: Privacy note (recommended for trust) */}
        <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
          No spam ever. Unsubscribe anytime.
        </p>
      </div>
    </>
  );
};
