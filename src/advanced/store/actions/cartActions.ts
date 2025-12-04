import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { cartAtom, totalItemCountAtom } from "../atoms/cartAtom";
import { productsAtom } from "../atoms/productsAtom";
import { useNotificationActions } from "./notificationActions";
import { getRemainingStock } from "../../models/cart";
import { ProductWithUI, MESSAGES } from "../../constants";

export const useCartActions = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const products = useAtomValue(productsAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const { addNotification } = useNotificationActions();

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
            addNotification(MESSAGES.STOCK_LIMIT_EXCEEDED(product.stock), "error");
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
    [cart, setCart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        addNotification(MESSAGES.STOCK_LIMIT_EXCEEDED(product.stock), "error");
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
    [products, removeFromCart, addNotification, setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
