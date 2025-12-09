export const productQuery = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  images,
  "collection": collection->{title, "slug": slug.current},
  category,
  cultural_tags,
  gemstone_type,
  material_type,
  featured,
  ar_2d_overlay,
  ar_3d_model,
  video_360,
  gold_weight,
  stones,
  labor_cost,
  pricing_model
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  price,
  images,
  "collection": collection->{title, "slug": slug.current},
  category,
  cultural_tags,
  gemstone_type,
  material_type,
  featured,
  ar_2d_overlay,
  ar_3d_model,
  video_360,
  gold_weight,
  stones,
  labor_cost,
  pricing_model
}`;

export const productsByCategoryQuery = `*[_type == "product" && category == $category] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  images,
  "collection": collection->{title, "slug": slug.current},
  category,
  cultural_tags,
  gemstone_type,
  material_type,
  featured,
  ar_2d_overlay,
  ar_3d_model,
  video_360,
  gold_weight,
  stones,
  labor_cost,
  pricing_model
}`;

export const collectionQuery = `*[_type == "collection"] | order(display_priority desc) {
  _id,
  title,
  "slug": slug.current,
  hero_image,
  description,
  cultural_audience,
  display_priority
}`;

export const collectionBySlugQuery = `*[_type == "collection" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  hero_image,
  description,
  cultural_audience,
  display_priority,
  "products": *[_type == "product" && references(^._id)] {
    _id,
    name,
    slug,
    description,
    price,
    images,
    category,
    cultural_tags,
    gemstone_type,
    material_type,
    featured,
    ar_2d_overlay,
    ar_3d_model,
    video_360,
    gold_weight,
    stones,
    labor_cost,
    pricing_model
  }
}`;

export const homepageQuery = `*[_type == "homepage"][0] {
  hero_banner,
  featured_collections[]->{
    _id,
    title,
    "slug": slug.current,
    hero_image,
    description
  },
  ar_tryon_highlight,
  inauguration_event,
  cultural_sections[]{
    title,
    description,
    icon,
    image,
    season,
    link->{
      _type,
      _id,
      title,
      "slug": slug.current
    }
  }
}`;

export const featuredProductsQuery = `*[_type == "product" && featured == true] | order(_createdAt desc) [0...12] {
  _id,
  name,
  slug,
  description,
  price,
  images,
  "collection": collection->{title, "slug": slug.current},
  category,
  cultural_tags,
  gemstone_type,
  material_type,
  featured,
  ar_2d_overlay,
  ar_3d_model,
  video_360,
  gold_weight,
  stones,
  labor_cost,
  pricing_model
}`;
