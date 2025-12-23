"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../layout";
import { Package, Save, X, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    material_type: "",
    stones: [] as Array<{ type: string; size?: string; weight?: number; quantity?: number }>,
    gold_weight: "",
    cultural_tags: [] as string[],
    featured: false,
    pricing_model: "fixed" as "fixed" | "dynamic",
    images: [] as Array<{ asset: { _ref: string }; alt?: string }>,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const categories = [
    "Necklaces",
    "Earrings",
    "Rings",
    "Bracelets",
    "Bangles",
    "Pendants",
    "Men's Jewelry",
  ];

  const materialTypes = ["Gold", "Silver", "Platinum", "Mixed"];
  const gemstoneTypes = [
    "Diamond",
    "Ruby",
    "Sapphire",
    "Emerald",
    "Pearl",
    "Other",
  ];

  const handleStoneChange = (index: number, field: string, value: any) => {
    const newStones = [...formData.stones];
    if (!newStones[index]) {
      newStones[index] = { type: "", quantity: 1 };
    }
    newStones[index] = { ...newStones[index], [field]: value };
    setFormData((prev) => ({ ...prev, stones: newStones }));
  };

  const addStone = () => {
    setFormData((prev) => ({
      ...prev,
      stones: [...prev.stones, { type: "", quantity: 1 }],
    }));
  };

  const removeStone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stones: prev.stones.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("alt", `${formData.name || "Product"} image`);

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to upload image");
        }

        const data = await response.json();
        return data;
      });

      const uploadResults = await Promise.all(uploadPromises);
      const uploadedImages = uploadResults.map((result) => result.image);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      // Use the URL from the upload response
      const previewUrls = uploadResults.map((result) => result.url).filter(Boolean);
      setImagePreviewUrls((prev) => [...prev, ...previewUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          gold_weight: formData.gold_weight
            ? parseFloat(formData.gold_weight)
            : undefined,
          stones: formData.stones.filter((stone) => stone.type), // Only send stones with type
          images: formData.images, // Include uploaded images
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              Add New Product
            </h1>
            <p className="text-charcoal/70">
              Create a new product in your catalog
            </p>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 bg-gray-200 text-charcoal px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (GBP) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Material Type
                </label>
                <select
                  value={formData.material_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      material_type: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select material</option>
                  {materialTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Stones / Gemstones
                </label>
                <div className="space-y-3">
                  {formData.stones.map((stone, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                          required
                          value={stone.type || ""}
                          onChange={(e) =>
                            handleStoneChange(index, "type", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select stone type</option>
                          {gemstoneTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Size (e.g., 2.5ct, 5mm)"
                          value={stone.size || ""}
                          onChange={(e) =>
                            handleStoneChange(index, "size", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Weight (carats)"
                          value={stone.weight || ""}
                          onChange={(e) =>
                            handleStoneChange(
                              index,
                              "weight",
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={stone.quantity || 1}
                          onChange={(e) =>
                            handleStoneChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStone(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStone}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    + Add Stone
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add multiple stones to your product. Leave empty if no stones.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Gold Weight (grams)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.gold_weight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gold_weight: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Pricing Model
                </label>
                <select
                  value={formData.pricing_model}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pricing_model: e.target.value as "fixed" | "dynamic",
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="dynamic">Dynamic (Gold-based)</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-900">
                  Featured Product
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              Images
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload product images. Recommended: 800x800px minimum, JPG or PNG format. First image will be the main product image.
            </p>
            
            {/* Image Upload Area */}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block cursor-pointer"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  {uploadingImages ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-gray-600">Uploading images...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG up to 10MB (multiple files supported)
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {imagePreviewUrls[index] && (
                      <img
                        src={imagePreviewUrls[index]}
                        alt={image.alt || `Product image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs px-2 py-1">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creating..." : "Create Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

