import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import {
  fetchProductBySlug,
  fetchFeaturedProducts,
  enrichProductWithDynamicPrice,
} from "@/lib/sanity/data-fetcher";
import { notFound } from "next/navigation";
import ProductARButton from "@/components/ProductARButton";
import { urlForImage } from "@/lib/sanity/image";
import Video360Player from "@/components/Video360Player";
import DynamicPrice from "@/components/DynamicPrice";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Enrich product with dynamic price if applicable
  product = await enrichProductWithDynamicPrice(product);

  const allFeatured = await fetchFeaturedProducts();
  const relatedProducts = allFeatured.filter((p: any) => p._id !== product._id).slice(0, 4);
  const hasAR = product.ar_2d_overlay || product.ar_3d_model;

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-charcoal/70 hover:text-emerald transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Collections</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative h-96 w-full rounded-2xl overflow-hidden luxury-shadow">
                    <Image
                      src={typeof product.images[0] === 'string' ? product.images[0] : urlForImage(product.images[0])}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.slice(1, 5).map((image: any, index: number) => (
                        <div
                          key={index}
                          className="relative h-24 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={typeof image === 'string' ? image : urlForImage(image)}
                            alt={`${product.name} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 360 Video - Limited to 20 seconds */}
                  {(product as any).video_360 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-serif font-semibold text-charcoal mb-3">
                        360° View
                      </h3>
                      <Video360Player videoUrl={(product as any).video_360} />
                    </div>
                  )}
                </>
              ) : (
                <div className="relative h-96 w-full rounded-2xl overflow-hidden luxury-shadow bg-gradient-to-br from-emerald/20 to-gold/20 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-emerald/30" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal mb-4">
                  {product.name}
                </h1>
                {(product.price || (product as any).displayPrice) && (
                  <DynamicPrice
                    product={product as any}
                    fallbackPrice={(product as any).displayPrice || product.price}
                    showUpdateTime={true}
                  />
                )}
              </div>

              {product.description && (
                <div>
                  <h2 className="text-xl font-serif font-semibold text-charcoal mb-3">
                    Description
                  </h2>
                  <p className="text-charcoal/70 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-4">
                {product.category && (
                  <div>
                    <span className="text-sm font-semibold text-charcoal/50">
                      Category:
                    </span>{" "}
                    <span className="text-charcoal capitalize">
                      {product.category}
                    </span>
                  </div>
                )}
                {product.material_type && (
                  <div>
                    <span className="text-sm font-semibold text-charcoal/50">
                      Material:
                    </span>{" "}
                    <span className="text-charcoal">{product.material_type}</span>
                  </div>
                )}
                {product.gemstone_type && (
                  <div>
                    <span className="text-sm font-semibold text-charcoal/50">
                      Gemstone:
                    </span>{" "}
                    <span className="text-charcoal">{product.gemstone_type}</span>
                  </div>
                )}
                {(product as any).gold_weight && (
                  <div>
                    <span className="text-sm font-semibold text-charcoal/50">
                      Gold Weight:
                    </span>{" "}
                    <span className="text-charcoal">
                      {(product as any).gold_weight}g
                    </span>
                  </div>
                )}
                {(product as any).stones &&
                  (product as any).stones.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-charcoal/50">
                        Stones:
                      </span>{" "}
                      <div className="mt-2 space-y-1">
                        {(product as any).stones.map(
                          (stone: any, index: number) => (
                            <div
                              key={index}
                              className="text-charcoal text-sm"
                            >
                              {stone.type}
                              {stone.weight && ` - ${stone.weight}ct`}
                              {stone.size && ` (${stone.size})`}
                              {stone.quantity && stone.quantity > 1
                                ? ` x${stone.quantity}`
                                : ""}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {product.cultural_tags && product.cultural_tags.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-charcoal/50">
                      Cultural Tags:
                    </span>{" "}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.cultural_tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product as any} />

              {/* AR Try-On Button */}
              {hasAR && (
                <ProductARButton
                  product={product}
                  className="w-full mt-4"
                />
              )}

              {/* Contact Button */}
              <Link
                href="/store"
                className="block w-full text-center px-8 py-4 bg-emerald text-white font-semibold rounded-lg hover:bg-emerald-dark transition-all duration-300 hover-glow mt-4"
              >
                Enquire About This Piece
              </Link>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-8">
                You May Also Like
              </h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

