import React from "react";
import { Product, CartItem } from "../../../types";
import { ProductWithUI, EMPTY_PRODUCT_FORM } from "../../constants";
import { isSoldOut } from "../../models/cart";
import { getStockBadgeClass } from "../../models/product";
import { formatPriceKor } from "../../utils/formatters";
import { Button, Card } from "../ui";

interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

interface ProductAccordionProps {
  products: Product[];
  cart: CartItem[];
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  deleteProduct: (id: string) => void;
}

export const ProductAccordion = ({
  products,
  cart,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  deleteProduct,
}: ProductAccordionProps) => {
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            variant="primary"
            onClick={() => {
              setEditingProduct("new");
              setProductForm(EMPTY_PRODUCT_FORM);
              setShowProductForm(true);
            }}
            className="bg-gray-900 hover:bg-gray-800"
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isSoldOut(products, cart, product.id)
                    ? "SOLD OUT"
                    : formatPriceKor(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(
                      product.stock
                    )}`}
                  >
                    {product.stock}개
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {(product as ProductWithUI).description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => startEditProduct(product as ProductWithUI)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ProductAccordion;
