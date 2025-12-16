import bestseller1 from "@/assets/bestseller-1.jpg";
import bestseller2 from "@/assets/bestseller-2.jpg";
import bestseller3 from "@/assets/bestseller-3.jpg";
import bestseller4 from "@/assets/bestseller-4.jpg";
import bestseller5 from "@/assets/bestseller-5.jpg";
import bestseller6 from "@/assets/bestseller-6.jpg";
import bestseller7 from "@/assets/bestseller-7.jpg";
import bestseller8 from "@/assets/bestseller-8.jpg";
import bestseller9 from "@/assets/bestseller-9.jpg";
import bestseller10 from "@/assets/bestseller-10.jpg";
import bestseller11 from "@/assets/bestseller-11.jpg";
import bestseller12 from "@/assets/bestseller-12.jpg";

export interface Product {
  id: number;
  name: string;
  price: string;
  priceInstallment?: string;
  image: string;
  images?: string[];
  discount?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  composition?: string;
}

export const allProducts: Product[] = [
  { 
    id: 1, 
    name: "блузка с бантом", 
    price: "799 BYN", 
    priceInstallment: "200 BYN",
    image: bestseller1,
    images: [bestseller1, bestseller2, bestseller3],
    description: "Элегантная блузка с бантом из мягкой ткани. Идеально подходит для создания женственного образа. Блузка легко сочетается с юбками, брюками и джинсами.",
    colors: ["Белый", "Чёрный"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "95% полиэстер, 5% эластан"
  },
  { 
    id: 2, 
    name: "платье с открытой спиной", 
    price: "869 BYN",
    priceInstallment: "217 BYN",
    image: bestseller2,
    images: [bestseller2, bestseller5, bestseller8],
    description: "Изысканное платье с открытой спиной для особых случаев. Подчёркивает силуэт и создаёт элегантный образ.",
    colors: ["Чёрный", "Бордо"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "92% вискоза, 8% эластан"
  },
  { 
    id: 3, 
    name: "кейп", 
    price: "529 BYN",
    priceInstallment: "132 BYN",
    image: bestseller3,
    images: [bestseller3, bestseller4],
    description: "Стильный кейп для прохладной погоды. Универсальный элемент гардероба, который дополнит любой образ.",
    colors: ["Бежевый", "Чёрный"],
    sizes: ["One Size"],
    composition: "70% шерсть, 30% полиэстер"
  },
  { 
    id: 4, 
    name: "кроп-жакет", 
    price: "1 500 BYN",
    priceInstallment: "375 BYN",
    image: bestseller4, 
    images: [bestseller4, bestseller6, bestseller9],
    discount: "-20%",
    description: "Модный кроп-жакет из качественной ткани. Отлично сочетается с высокой талией брюк и юбок.",
    colors: ["Чёрный", "Белый", "Бежевый"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "65% полиэстер, 35% вискоза"
  },
  { 
    id: 5, 
    name: "платье-боди", 
    price: "1 099 BYN",
    priceInstallment: "275 BYN",
    image: bestseller5,
    images: [bestseller5, bestseller2, bestseller10],
    description: "Облегающее платье-боди для вечернего выхода. Создаёт идеальный силуэт и подчёркивает фигуру.",
    colors: ["Чёрный", "Красный"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "90% полиамид, 10% эластан"
  },
  { 
    id: 6, 
    name: "пиджак в полоску", 
    price: "1 599 BYN",
    priceInstallment: "400 BYN",
    image: bestseller6,
    images: [bestseller6, bestseller4, bestseller9],
    description: "Классический пиджак в полоску. Идеален для делового стиля и повседневных образов.",
    colors: ["Серый", "Синий"],
    sizes: ["XS-40", "S-42", "M-44", "L-46", "XL-48"],
    composition: "55% шерсть, 45% полиэстер"
  },
  { 
    id: 7, 
    name: "корсет бархат", 
    price: "629 BYN",
    priceInstallment: "157 BYN",
    image: bestseller7,
    images: [bestseller7, bestseller12],
    description: "Роскошный бархатный корсет. Универсальный элемент гардероба, который дополнит любой образ: с бархатным корсетом, рубашкой, блузой, футболкой и жакетом.",
    colors: ["Чёрный", "Бордо", "Изумрудный"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "95% полиэстер, 5% эластан"
  },
  { 
    id: 8, 
    name: "платье шёлк", 
    price: "1 299 BYN",
    priceInstallment: "325 BYN",
    image: bestseller8,
    images: [bestseller8, bestseller5, bestseller11],
    description: "Нежное шёлковое платье для особых случаев. Лёгкое и струящееся, создаёт романтичный образ.",
    colors: ["Айвори", "Пудра", "Чёрный"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "100% шёлк"
  },
  { 
    id: 9, 
    name: "костюм оверсайз", 
    price: "1 769 BYN",
    priceInstallment: "442 BYN",
    image: bestseller9,
    images: [bestseller9, bestseller6, bestseller4],
    description: "Современный костюм оверсайз. Сочетает комфорт и стиль, идеален для деловых встреч и повседневной носки.",
    colors: ["Чёрный", "Бежевый", "Серый"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "68% полиэстер, 32% вискоза"
  },
  { 
    id: 10, 
    name: "вечернее платье", 
    price: "2 269 BYN",
    priceInstallment: "567 BYN",
    image: bestseller10,
    images: [bestseller10, bestseller5, bestseller8, bestseller11],
    description: "Роскошное вечернее платье для особых событий. Создаёт незабываемый образ и подчёркивает женственность.",
    colors: ["Чёрный", "Синий", "Бордо"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "88% полиэстер, 12% эластан"
  },
  { 
    id: 11, 
    name: "платье металлик", 
    price: "1 429 BYN",
    priceInstallment: "357 BYN",
    image: bestseller11,
    images: [bestseller11, bestseller10],
    description: "Яркое платье с эффектом металлик. Идеально для вечеринок и особых мероприятий.",
    colors: ["Серебро", "Золото"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "85% полиэстер, 15% металлизированное волокно"
  },
  { 
    id: 12, 
    name: "корсет с брюками", 
    price: "1 199 BYN",
    priceInstallment: "300 BYN",
    image: bestseller12,
    images: [bestseller12, bestseller7],
    description: "Стильный комплект: корсет с высокими брюками. Создаёт элегантный и современный образ.",
    colors: ["Чёрный", "Белый"],
    sizes: ["XS-40", "S-42", "M-44", "L-46"],
    composition: "92% полиэстер, 8% эластан"
  },
];

export const getProductById = (id: number): Product | undefined => {
  return allProducts.find(product => product.id === id);
};

export const getRelatedProducts = (currentId: number, count: number = 4): Product[] => {
  return allProducts.filter(product => product.id !== currentId).slice(0, count);
};
