import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Video, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DesignDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getDesign(slug: string) {
  return prisma.design.findUnique({ where: { slug, published: true } });
}

async function getRelatedDesigns(slug: string, category: string) {
  return prisma.design.findMany({
    where: { slug: { not: slug }, category, published: true },
    take: 3,
  });
}

export async function generateMetadata({ params }: DesignDetailPageProps) {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) return { title: "Design Not Found" };
  return { title: `${design.title} | Design`, description: design.description };
}

function MediaItem({
  url,
  title,
  index,
}: {
  url: string;
  title: string;
  index: number;
}) {
  const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);
  return (
    <div className="relative rounded-xl overflow-hidden bg-muted">
      {isVideo ? (
        <div className="relative">
          <video src={url} controls className="w-full" />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded flex items-center gap-1">
            <Video className="w-3 h-3" /> Video
          </div>
        </div>
      ) : (
        <img src={url} alt={`${title} - ${index + 1}`} className="w-full" />
      )}
    </div>
  );
}

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) notFound();

  const relatedDesigns = await getRelatedDesigns(slug, design.category);
  const isMainVideo = design.image?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Link
          href="/design"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Designs</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            {design.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {design.title}
          </h1>

          {/* Main Media */}
          <div className="rounded-2xl overflow-hidden bg-muted mb-8">
            {design.image ? (
              isMainVideo ? (
                <video src={design.image} controls className="w-full" />
              ) : (
                <img src={design.image} alt={design.title} className="w-full" />
              )
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Description */}
          {design.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About This Design</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {design.description}
              </p>
            </div>
          )}

          {/* Media Gallery */}
          {design.media.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {design.media.map((url, index) => (
                  <MediaItem
                    key={index}
                    url={url}
                    title={design.title}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {design.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {design.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Related */}
          {relatedDesigns.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold mb-6">Related Designs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDesigns.map((d) => (
                  <Link key={d.id} href={`/design/${d.slug}`} className="group">
                    <div className="rounded-xl overflow-hidden bg-muted aspect-4/3 mb-3">
                      {d.image ? (
                        <img
                          src={d.image}
                          alt={d.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {d.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
