import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import { allProducts } from "@/data/products";

export interface LookbookItem {
  id: number;
  name: string;
  mainImage: string;
  productIds: number[];
}

export const lookbookItems: LookbookItem[] = [
  {
    id: 1,
    name: "LOOK1",
    mainImage: lookbook1,
    productIds: [1, 7],
  },
  {
    id: 2,
    name: "LOOK2",
    mainImage: lookbook2,
    productIds: [2, 12],
  },
  {
    id: 3,
    name: "LOOK3",
    mainImage: lookbook3,
    productIds: [8, 4],
  },
  {
    id: 4,
    name: "LOOK4",
    mainImage: lookbook1,
    productIds: [5, 6],
  },
  {
    id: 5,
    name: "LOOK5",
    mainImage: lookbook2,
    productIds: [9, 10],
  },
  {
    id: 6,
    name: "LOOK6",
    mainImage: lookbook3,
    productIds: [11, 3],
  },
];

export const getProductsForLook = (productIds: number[]) => {
  return productIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
};

export const TELEGRAM_LINK = "https://t.me/rumor_store";
