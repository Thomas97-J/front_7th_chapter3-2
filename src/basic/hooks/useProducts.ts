import { useState, useCallback, useEffect } from "react";
import { Product } from "../../types";
import {
  ProductWithUI,
  INITIAL_PRODUCTS,
  STORAGE_KEYS,
  MESSAGES,
} from "../constants";
interface UseProductsParams {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const useProducts = ({ addNotification }: UseProductsParams) => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification(MESSAGES.PRODUCT_ADDED, "success");

      return product;
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification(MESSAGES.PRODUCT_UPDATED, "success");
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification(MESSAGES.PRODUCT_DELETED, "success");
    },
    [addNotification]
  );

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
