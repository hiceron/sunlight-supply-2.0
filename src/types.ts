/**
 * Product interface represents a product in the shop and admin modules.
 *
 * Properties:
 *   - id: Unique identifier for the product.
 *   - name: Product name.
 *   - description: Product description.
 *   - sku: Stock Keeping Unit identifier.
 *   - price: Price per ton.
 *   - availableColors: List of available color hex codes.
 *   - availableQuantity: Quantity available in stock.
 *   - image: Product image URL.
 *   - category: Product category.
 *   - tags: Array of tag strings.
 *   - reorderThreshold: Stock level at which low stock is flagged.
 *   - variants: Optional variants (e.g., color/size) with their own SKU, price, and quantity.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  availableColors: string[];
  availableQuantity: number;
  image: string;
  category: string;
  tags: string[];
  reorderThreshold: number;
  variants?: {
    [key: string]: {
      sku: string;
      price: number;
      quantity: number;
      attributes: {
        color?: string;
        size?: string;
      };
    };
  };
}

export interface CartItem extends Product {
  selectedColor: string;
  quantity: number;
}