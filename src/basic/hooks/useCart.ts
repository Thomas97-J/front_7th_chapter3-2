import { useState, useCallback, useEffect, useMemo } from "react";
import { CartItem, Product } from "../../types";
import { getRemainingStock } from "../models/cart";
import { ProductWithUI, STORAGE_KEYS, MESSAGES } from "../constants";
interface UseCartParams {
  products: Product[];
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}
export const useCart = ({ products, addNotification }: UseCartParams) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification(MESSAGES.OUT_OF_STOCK, "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              MESSAGES.STOCK_LIMIT_EXCEEDED(product.stock),
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification(MESSAGES.CART_ITEM_ADDED, "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(MESSAGES.STOCK_LIMIT_EXCEEDED(maxStock), "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
