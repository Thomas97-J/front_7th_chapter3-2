import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../atoms/couponsAtom";
import { cartAtom } from "../atoms/cartAtom";
import { calculateCartTotal } from "../../models/cart";
import { Coupon } from "../../../types";
import { MESSAGES, BUSINESS_RULES } from "../../constants";
import { useNotification } from "../../hooks/useNotification";

export const useCouponsActions = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const cart = useAtomValue(cartAtom);
  const { addNotification } = useNotification();

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
    [coupons, setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(MESSAGES.COUPON_DELETED, "success");
    },
    [selectedCoupon, setCoupons, setSelectedCoupon, addNotification]
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
    [cart, setSelectedCoupon, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  };
};
