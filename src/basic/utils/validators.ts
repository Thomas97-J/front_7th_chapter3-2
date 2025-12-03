// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// TODO: 구현

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  correctedValue?: number;
}

export const isNumericInput = (value: string): boolean => {
  if (value === "") return true;
  return /^\d+$/.test(value);
};

export const validateProductPrice = (price: number): ValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      error: "가격은 0보다 커야 합니다",
      correctedValue: 0,
    };
  }
  return { isValid: true };
};

export const validateProductStock = (stock: number): ValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      error: "재고는 0보다 커야 합니다",
      correctedValue: 0,
    };
  }
  if (stock > 9999) {
    return {
      isValid: false,
      error: "재고는 9999개를 초과할 수 없습니다",
      correctedValue: 9999,
    };
  }
  return { isValid: true };
};

export const validateCouponPercentage = (value: number): ValidationResult => {
  if (value < 0) {
    return {
      isValid: false,
      error: undefined, // 조용히 수정
      correctedValue: 0,
    };
  }
  if (value > 100) {
    return {
      isValid: false,
      error: "할인율은 100%를 초과할 수 없습니다",
      correctedValue: 100,
    };
  }
  return { isValid: true };
};

export const validateCouponAmount = (value: number): ValidationResult => {
  if (value < 0) {
    return {
      isValid: false,
      error: undefined, // 조용히 수정
      correctedValue: 0,
    };
  }
  if (value > 100000) {
    return {
      isValid: false,
      error: "할인 금액은 100,000원을 초과할 수 없습니다",
      correctedValue: 100000,
    };
  }
  return { isValid: true };
};

export const isValidCouponCode = (code: string): boolean => {
  return /^[A-Z0-9]{4,12}$/.test(code);
};

export const isValidStock = (stock: number): boolean => {
  return stock >= 0;
};

export const isValidPrice = (price: number): boolean => {
  return price > 0;
};

export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};
