export interface Product {
  id: string;
  name: string;
  price: number;
  availableColors: string[];
  availableQuantity: number;
  image: string;
}

export interface CartItem extends Product {
  selectedColor: string;
  quantity: number;
}