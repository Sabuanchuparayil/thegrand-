// Shopping cart management

import { calculateOrderTotalsWithVAT, UK_VAT_RATE } from "@/lib/tax/uk-tax";

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  image?: string;
  price: number;
  quantity: number;
  materialType?: string;
  goldWeight?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const SHIPPING_COST = 15; // £15 standard shipping

/**
 * Calculate cart totals with UK VAT
 */
export function calculateCartTotals(items: CartItem[]): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : SHIPPING_COST; // Free shipping over £500
  
  // Use UK tax calculation
  const totals = calculateOrderTotalsWithVAT(subtotal, shipping, UK_VAT_RATE);

  // Map vat to tax for consistency
  return {
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.vat, // Map vat to tax
    total: totals.total,
  };
}

/**
 * Get cart from localStorage
 */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

/**
 * Add item to cart
 */
export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) => i.productId === item.productId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  return cart;
}

/**
 * Update item quantity
 */
export function updateCartItem(
  productId: string,
  quantity: number
): CartItem[] {
  const cart = getCart();
  const itemIndex = cart.findIndex((i) => i.productId === productId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }

  saveCart(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart();
  const filtered = cart.filter((i) => i.productId !== productId);
  saveCart(filtered);
  return filtered;
}

/**
 * Clear cart
 */
export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cart");
}

/**
 * Get cart item count
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

