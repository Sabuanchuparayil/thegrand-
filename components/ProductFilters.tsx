"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const occasions = [
  "Wedding",
  "Festival",
  "Eid",
  "Diwali",
  "Cocktail",
  "Bridal",
];

const styles = [
  "Traditional",
  "Modern",
  "Fusion",
  "Ethnic",
  "Minimalist",
];

const materials = ["22k Gold", "18k Gold", "Diamond", "Emerald", "Pearl"];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentOccasion = searchParams.get("occasion") || "";
  const currentStyle = searchParams.get("style") || "";
  const currentMaterial = searchParams.get("material") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const activeFiltersCount =
    (currentOccasion ? 1 : 0) +
    (currentStyle ? 1 : 0) +
    (currentMaterial ? 1 : 0);

  return (
    <div className="mb-8">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-emerald text-white rounded-lg mb-4"
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-emerald rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block bg-white rounded-lg p-6 luxury-shadow`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-semibold text-charcoal flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Products</span>
          </h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-emerald hover:text-emerald-dark flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Occasion Filter */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">
              Occasion
            </label>
            <div className="space-y-2">
              {occasions.map((occasion) => (
                <label
                  key={occasion}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="occasion"
                    value={occasion}
                    checked={currentOccasion === occasion}
                    onChange={(e) =>
                      updateFilter("occasion", e.target.checked ? occasion : "")
                    }
                    className="w-4 h-4 text-emerald focus:ring-emerald"
                  />
                  <span className="text-charcoal/70">{occasion}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">
              Style
            </label>
            <div className="space-y-2">
              {styles.map((style) => (
                <label
                  key={style}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="style"
                    value={style}
                    checked={currentStyle === style}
                    onChange={(e) =>
                      updateFilter("style", e.target.checked ? style : "")
                    }
                    className="w-4 h-4 text-emerald focus:ring-emerald"
                  />
                  <span className="text-charcoal/70">{style}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">
              Material
            </label>
            <div className="space-y-2">
              {materials.map((material) => (
                <label
                  key={material}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="material"
                    value={material}
                    checked={currentMaterial === material}
                    onChange={(e) =>
                      updateFilter("material", e.target.checked ? material : "")
                    }
                    className="w-4 h-4 text-emerald focus:ring-emerald"
                  />
                  <span className="text-charcoal/70">{material}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



