import React from "react";
import { Coupon } from "../../../types";
import { formatCouponValue } from "../../models/coupon";
import { Card } from "../ui";
import { PlusIcon, TrashIcon } from "../icons";

interface CouponListProps {
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CouponList = ({
  coupons,
  deleteCoupon,
  showCouponForm,
  setShowCouponForm,
}: CouponListProps) => {
  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 font-mono">
                    {coupon.code}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                      {formatCouponValue(
                        coupon.discountType,
                        coupon.discountValue
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteCoupon(coupon.code)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <PlusIcon className="w-8 h-8" />
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CouponList;
