import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon } from "../../types";
import { calculateCartTotal } from "../models/cart";
import {
  INITIAL_COUPONS,
  STORAGE_KEYS,
  MESSAGES,
  BUSINESS_RULES,
} from "../constants";

interface UseCouponsParams {
  cart: CartItem[];
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const useCoupons = ({ cart, addNotification }: UseCouponsParams) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(MESSAGES.COUPON_CODE_EXISTS, "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification(MESSAGES.COUPON_ADDED, "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(MESSAGES.COUPON_DELETED, "success");
    },
    [selectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (
        currentTotal < BUSINESS_RULES.MIN_PURCHASE_FOR_PERCENTAGE_COUPON &&
        coupon.discountType === "percentage"
      ) {
        addNotification(MESSAGES.PERCENTAGE_COUPON_MIN_PURCHASE, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification(MESSAGES.COUPON_APPLIED, "success");
    },
    [cart, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  };
};
