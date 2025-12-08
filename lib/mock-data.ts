// Mock data with placeholder images for development/testing
// Note: 360 videos should be under 20 seconds in length for optimal user experience

export const mockProducts = [
  {
    _id: "mock-1",
    name: "Traditional Indian Bridal Necklace Set",
    slug: { current: "traditional-indian-bridal-necklace" },
    description:
      "Exquisite 22k gold necklace set with intricate traditional designs, perfect for bridal occasions. Features premium diamonds and emeralds.",
    price: 12500,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "necklaces",
    cultural_tags: ["Traditional Indian Bridal", "Wedding", "Bridal"],
    gemstone_type: "Diamond",
    material_type: "22k Gold",
    featured: true,
    ar_2d_overlay: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&auto=format",
    ar_3d_model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 85, // grams
    stones: [
      { type: "Diamond", size: "2.5 carats", weight: 2.5, quantity: 12 },
      { type: "Emerald", size: "1 carat", weight: 1, quantity: 8 },
    ],
    labor_cost: 2500, // GBP
  },
  {
    _id: "mock-2",
    name: "Contemporary Minimalist Gold Ring",
    slug: { current: "contemporary-minimalist-ring" },
    description:
      "Elegant 18k gold ring with modern minimalist design. Perfect for everyday wear or special occasions.",
    price: 850,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    category: "rings",
    cultural_tags: ["Contemporary Minimalist", "Modern"],
    gemstone_type: "None",
    material_type: "18k Gold",
    featured: true,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 8, // grams
    stones: [],
    labor_cost: 200, // GBP
  },
  {
    _id: "mock-3",
    name: "Middle Eastern Ornate Earrings",
    slug: { current: "middle-eastern-ornate-earrings" },
    description:
      "Stunning ornate earrings inspired by Middle Eastern design traditions. Features intricate patterns and premium gold.",
    price: 2200,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    category: "earrings",
    cultural_tags: ["Middle Eastern Ornate", "Festival", "Eid"],
    gemstone_type: "Emerald",
    material_type: "22k Gold",
    featured: true,
    ar_2d_overlay: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop&auto=format",
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 12, // grams
    stones: [
      { type: "Emerald", size: "0.5 carats", weight: 0.5, quantity: 2 },
    ],
    labor_cost: 400, // GBP
  },
  {
    _id: "mock-4",
    name: "Western Engagement Diamond Ring",
    slug: { current: "western-engagement-diamond-ring" },
    description:
      "Classic solitaire engagement ring featuring a brilliant cut diamond in platinum setting.",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    category: "rings",
    cultural_tags: ["Western Engagement", "Wedding"],
    gemstone_type: "Diamond",
    material_type: "Platinum",
    featured: true,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 6, // grams (platinum weight)
    stones: [
      { type: "Diamond", size: "1.5 carats", weight: 1.5, quantity: 1 },
    ],
    labor_cost: 800, // GBP
  },
  {
    _id: "mock-5",
    name: "Traditional Gold Bangles Set",
    slug: { current: "traditional-gold-bangles" },
    description:
      "Set of six traditional 22k gold bangles with engraved patterns. Perfect for festivals and celebrations.",
    price: 1800,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "bangles",
    cultural_tags: ["Traditional Indian Bridal", "Festival", "Diwali"],
    gemstone_type: "None",
    material_type: "22k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 60, // grams (total for 6 bangles)
    stones: [],
    labor_cost: 500, // GBP
  },
  {
    _id: "mock-6",
    name: "Afro-Caribbean Gold Pendant",
    slug: { current: "afro-caribbean-gold-pendant" },
    description:
      "Bold and beautiful gold pendant with Afro-Caribbean design influences. A statement piece for any occasion.",
    price: 950,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    category: "pendants",
    cultural_tags: ["Afro-Caribbean"],
    gemstone_type: "None",
    material_type: "18k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 10, // grams
    stones: [],
    labor_cost: 300, // GBP
  },
  {
    _id: "mock-7",
    name: "Men's Gold Chain",
    slug: { current: "mens-gold-chain" },
    description:
      "Classic men's gold chain in 22k gold. Timeless design suitable for all occasions.",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    category: "mens-jewelry",
    cultural_tags: ["Contemporary Minimalist"],
    gemstone_type: "None",
    material_type: "22k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 20, // grams
    stones: [],
    labor_cost: 400, // GBP
  },
  {
    _id: "mock-8",
    name: "Pearl and Gold Bracelet",
    slug: { current: "pearl-gold-bracelet" },
    description:
      "Elegant bracelet combining premium pearls with 18k gold links. Perfect for cocktail events and formal occasions.",
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    category: "bracelets",
    cultural_tags: ["Contemporary Minimalist", "Cocktail"],
    gemstone_type: "Pearl",
    material_type: "18k Gold",
    featured: true,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 15, // grams
    stones: [
      { type: "Pearl", size: "8mm", weight: 0, quantity: 12 },
    ],
    labor_cost: 350, // GBP
  },
  // Additional products for complete coverage
  {
    _id: "mock-9",
    name: "Emerald Drop Necklace",
    slug: { current: "emerald-drop-necklace" },
    description:
      "Stunning emerald drop necklace in 22k gold setting. A statement piece for special occasions.",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "necklaces",
    cultural_tags: ["Traditional Indian Bridal", "Festival"],
    gemstone_type: "Emerald",
    material_type: "22k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreet.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 35, // grams
    stones: [
      { type: "Emerald", size: "3 carats", weight: 3, quantity: 1 },
    ],
    labor_cost: 800, // GBP
  },
  {
    _id: "mock-10",
    name: "Diamond Stud Earrings",
    slug: { current: "diamond-stud-earrings" },
    description:
      "Classic diamond stud earrings in platinum. Timeless elegance for everyday luxury.",
    price: 2800,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    category: "earrings",
    cultural_tags: ["Contemporary Minimalist", "Western Engagement"],
    gemstone_type: "Diamond",
    material_type: "Platinum",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 4, // grams (platinum weight)
    stones: [
      { type: "Diamond", size: "0.5 carats", weight: 0.5, quantity: 2 },
    ],
    labor_cost: 600, // GBP
  },
  {
    _id: "mock-11",
    name: "Ruby and Gold Ring",
    slug: { current: "ruby-gold-ring" },
    description:
      "Vibrant ruby set in 18k gold ring. Perfect for adding color to your jewelry collection.",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    category: "rings",
    cultural_tags: ["Traditional Indian Bridal", "Festival"],
    gemstone_type: "Ruby",
    material_type: "18k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 7, // grams
    stones: [
      { type: "Ruby", size: "1 carat", weight: 1, quantity: 1 },
    ],
    labor_cost: 250, // GBP
  },
  {
    _id: "mock-12",
    name: "Gold Chain Bracelet",
    slug: { current: "gold-chain-bracelet" },
    description:
      "Elegant gold chain bracelet with intricate links. Versatile design for any occasion.",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "bracelets",
    cultural_tags: ["Contemporary Minimalist"],
    gemstone_type: "None",
    material_type: "18k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 18, // grams
    stones: [],
    labor_cost: 300, // GBP
  },
  {
    _id: "mock-13",
    name: "Traditional Kundan Bangles",
    slug: { current: "traditional-kundan-bangles" },
    description:
      "Exquisite Kundan bangles with traditional Indian craftsmanship. Perfect for weddings and festivals.",
    price: 3200,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "bangles",
    cultural_tags: ["Traditional Indian Bridal", "Wedding", "Diwali"],
    gemstone_type: "Diamond",
    material_type: "22k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 70, // grams (total for set)
    stones: [
      { type: "Diamond", size: "1 carat", weight: 1, quantity: 20 },
    ],
    labor_cost: 1000, // GBP
  },
  {
    _id: "mock-14",
    name: "Sapphire Pendant Necklace",
    slug: { current: "sapphire-pendant-necklace" },
    description:
      "Beautiful sapphire pendant on a delicate gold chain. A sophisticated addition to any collection.",
    price: 2100,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    category: "pendants",
    cultural_tags: ["Contemporary Minimalist", "Western Engagement"],
    gemstone_type: "Sapphire",
    material_type: "18k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 12, // grams
    stones: [
      { type: "Sapphire", size: "2 carats", weight: 2, quantity: 1 },
    ],
    labor_cost: 400, // GBP
  },
  {
    _id: "mock-15",
    name: "Men's Gold Cufflinks",
    slug: { current: "mens-gold-cufflinks" },
    description:
      "Elegant gold cufflinks with classic design. Perfect for formal occasions and business attire.",
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    ],
    category: "mens-jewelry",
    cultural_tags: ["Contemporary Minimalist"],
    gemstone_type: "None",
    material_type: "18k Gold",
    featured: false,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 5, // grams
    stones: [],
    labor_cost: 150, // GBP
  },
  {
    _id: "mock-16",
    name: "Bridal Choker Set",
    slug: { current: "bridal-choker-set" },
    description:
      "Complete bridal choker set with matching earrings. Traditional design with modern elegance.",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop",
    ],
    category: "necklaces",
    cultural_tags: ["Traditional Indian Bridal", "Wedding", "Bridal"],
    gemstone_type: "Diamond",
    material_type: "22k Gold",
    featured: true,
    video_360: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Placeholder - replace with actual 360 video URL
    pricing_model: "dynamic",
    gold_weight: 75, // grams
    stones: [
      { type: "Diamond", size: "2 carats", weight: 2, quantity: 15 },
    ],
    labor_cost: 2000, // GBP
  },
];

export const mockCollections = [
  {
    _id: "mock-col-1",
    title: "Bridal & Wedding Collection",
    slug: { current: "bridal-wedding" },
    hero_image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
    description:
      "Exquisite bridal jewelry collections celebrating love and tradition. Perfect for your special day.",
    cultural_audience: ["South Asian", "Middle Eastern", "Universal"],
    display_priority: 5,
  },
  {
    _id: "mock-col-2",
    title: "Contemporary Minimalist",
    slug: { current: "contemporary" },
    hero_image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop",
    description:
      "Modern elegance meets timeless design. Clean lines and sophisticated simplicity.",
    cultural_audience: ["Western European", "Universal"],
    display_priority: 4,
  },
  {
    _id: "mock-col-3",
    title: "Heritage Classics",
    slug: { current: "heritage-classics" },
    hero_image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&h=800&fit=crop",
    description:
      "Timeless pieces inspired by traditional craftsmanship and cultural heritage.",
    cultural_audience: ["South Asian", "Middle Eastern", "African"],
    display_priority: 3,
  },
  {
    _id: "mock-col-4",
    title: "Middle Eastern Ornate",
    slug: { current: "middle-eastern" },
    hero_image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop",
    description:
      "Intricate designs and ornate patterns celebrating Middle Eastern artistic traditions.",
    cultural_audience: ["Middle Eastern"],
    display_priority: 2,
  },
  {
    _id: "mock-col-5",
    title: "Minimalist Western",
    slug: { current: "minimalist-western" },
    hero_image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&h=800&fit=crop",
    description:
      "Clean, modern designs inspired by Western aesthetics. Minimalist elegance for the contemporary woman.",
    cultural_audience: ["Western European", "Universal"],
    display_priority: 1,
  },
];

export const mockHomepage = {
  hero_banner: {
    headline: "Timeless Elegance, Cultural Heritage",
    subheadline:
      "Discover our exquisite collection of luxury jewelry, crafted for the modern connoisseur",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop",
    // Video placeholder - you can replace with actual video URL
    video: null,
  },
  featured_collections: mockCollections.slice(0, 3),
  ar_tryon_highlight: {
    title: "Experience AR Try-On",
    description:
      "See how our jewelry looks on you before you buy. Try on necklaces, earrings, and rings in augmented reality.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&h=800&fit=crop",
  },
  inauguration_event: {
    title: "UK Inauguration Launch",
    description:
      "Join us for the grand opening of THE GRAND GOLD & DIAMONDS in the UK. Experience our luxury collections and meet our master craftsmen.",
    date: "Coming Soon",
    location: "London, United Kingdom",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop",
  },
};

// Placeholder video URLs (you can replace these with actual video URLs)
export const mockVideos = {
  hero: "https://videos.pexels.com/video-files/3044083/3044083-hd_1920_1080_30fps.mp4", // Example - replace with your video
  // Alternative: Use a placeholder service or your own hosted videos
};

