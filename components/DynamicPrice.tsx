"use client";

import { useEffect, useState } from "react";
// Only import pure calculation functions, not server-side functions
import type { Product } from "@/lib/gold-price/calculator";
import { calculateGoldValue, calculateStoneValue } from "@/lib/gold-price/calculator";

interface DynamicPriceProps {
  product: Product;
  className?: string;
  showUpdateTime?: boolean;
  fallbackPrice?: number;
}

interface PriceData {
  price: number;
  timestamp: Date;
  loading: boolean;
  error: string | null;
}

export default function DynamicPrice({
  product,
  className = "",
  showUpdateTime = false,
  fallbackPrice,
}: DynamicPriceProps) {
  const [priceData, setPriceData] = useState<PriceData>({
    price: fallbackPrice || product.price || 0,
    timestamp: new Date(),
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Only calculate if pricing model is dynamic
    if (product.pricing_model !== "dynamic") {
      setPriceData({
        price: product.price || 0,
        timestamp: new Date(),
        loading: false,
        error: null,
      });
      return;
    }

    // Validate required fields
    if (!product.material_type || !product.gold_weight) {
      setPriceData({
        price: product.price || 0,
        timestamp: new Date(),
        loading: false,
        error: "Missing required fields for dynamic pricing",
      });
      return;
    }

    // Calculate price using API route
    const calculatePrice = async () => {
      try {
        setPriceData((prev) => ({ ...prev, loading: true, error: null }));
        
        // Fetch current metal price from API
        const material = product.material_type || "";
        const response = await fetch(
          `/api/gold-price?material=${encodeURIComponent(material)}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch gold price");
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to fetch gold price");
        }
        
        const metalPricePerGram = data.price;
        
        // Calculate gold value
        const goldValue = calculateGoldValue(
          product.gold_weight || 0,
          material,
          metalPricePerGram
        );
        
        // Calculate stone value
        const stoneValue = calculateStoneValue(product.stones);
        
        // Calculate total
        const laborCost = product.labor_cost || 0;
        const calculatedPrice = goldValue + stoneValue + laborCost;
        
        setPriceData({
          price: Math.round(calculatedPrice * 100) / 100,
          timestamp: new Date(),
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error calculating dynamic price:", error);
        setPriceData({
          price: product.price || fallbackPrice || 0,
          timestamp: new Date(),
          loading: false,
          error: "Failed to calculate price",
        });
      }
    };

    calculatePrice();

    // Refresh price every 5 minutes
    const interval = setInterval(calculatePrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [product, fallbackPrice]);

  const formatPrice = (price: number) => {
    return `£${price.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (priceData.loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-6 w-20 bg-charcoal/20 animate-pulse rounded" />
        <span className="text-xs text-charcoal/50">Calculating...</span>
      </div>
    );
  }

  if (priceData.error && product.pricing_model === "dynamic") {
    return (
      <div className={`flex flex-col ${className}`}>
        <p className="text-2xl font-bold text-gold">
          {formatPrice(priceData.price)}
        </p>
        <p className="text-xs text-charcoal/50 mt-1">
          Base price (market price unavailable)
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-2xl font-bold text-gold">
        {formatPrice(priceData.price)}
      </p>
      {product.pricing_model === "dynamic" && (
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-emerald font-semibold">
            Live Market Price
          </span>
          {showUpdateTime && (
            <span className="text-xs text-charcoal/50">
              Updated {formatTime(priceData.timestamp)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

