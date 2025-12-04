import React from "react";
import {
  validateCouponPercentage,
  validateCouponAmount,
} from "../../models/coupon";
import { isNumericInput } from "../../utils/validators";
import { Button, FormInput, FormSelect } from "../ui";

interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

interface CouponFormProps {
  couponForm: CouponFormData;
  setCouponForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  setShowCouponForm: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (e: React.FormEvent) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const CouponForm = ({
  couponForm,
  setCouponForm,
  setShowCouponForm,
  onSubmit,
  addNotification,
}: CouponFormProps) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput
            label="쿠폰명"
            type="text"
            value={couponForm.name}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                name: e.target.value,
              })
            }
            placeholder="신규 가입 쿠폰"
            required
            className="text-sm"
          />
          <FormInput
            label="쿠폰 코드"
            type="text"
            value={couponForm.code}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="WELCOME2024"
            required
            className="text-sm font-mono"
          />
          <FormSelect
            label="할인 타입"
            value={couponForm.discountType}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                discountType: e.target.value as "amount" | "percentage",
              })
            }
          >
            <option value="amount">정액 할인</option>
            <option value="percentage">정률 할인</option>
          </FormSelect>
          <FormInput
            label={
              couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"
            }
            type="text"
            value={
              couponForm.discountValue === 0 ? "" : couponForm.discountValue
            }
            onChange={(e) => {
              const value = e.target.value;
              if (isNumericInput(value)) {
                setCouponForm({
                  ...couponForm,
                  discountValue: value === "" ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 0;
              const result =
                couponForm.discountType === "percentage"
                  ? validateCouponPercentage(value)
                  : validateCouponAmount(value);

              if (!result.isValid) {
                if (result.error) {
                  addNotification(result.error, "error");
                }
                if (result.correctedValue !== undefined) {
                  setCouponForm({
                    ...couponForm,
                    discountValue: result.correctedValue,
                  });
                }
              }
            }}
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            required
            className="text-sm"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setShowCouponForm(false)}
          >
            취소
          </Button>
          <Button variant="primary" type="submit">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
