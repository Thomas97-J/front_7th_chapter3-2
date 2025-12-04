// Cart
export { cartAtom, totalItemCountAtom, isCartEmptyAtom } from "./atoms/cartAtom";

// Products
export { productsAtom } from "./atoms/productsAtom";

// Coupons
export {
  couponsAtom,
  selectedCouponAtom,
  couponCountAtom,
} from "./atoms/couponsAtom";

// Notifications
export {
  notificationsAtom,
  hasNotificationsAtom,
  type Notification,
} from "./atoms/notificationAtom";

// Actions
export { useNotificationActions } from "./actions/notificationActions";
export { useProductsActions } from "./actions/productsActions";
export { useCartActions } from "./actions/cartActions";
export { useCouponsActions } from "./actions/couponsActions";
