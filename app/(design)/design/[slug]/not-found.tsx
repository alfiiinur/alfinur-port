import Link from "next/link";

export default function DesignNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Project Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the project you&apos;re looking for. It
          may have been moved or deleted.
        </p>
        <Link
          href="/design"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
