export interface Product {
  id: string;
  name: string;
  nameTh: string;
  price: number;
  description: string;
  descriptionTh: string;
  category: string;
  icon: string;
  imageUrl: string;
  specifications: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'bank' | 'promptpay';

export type ScreenState = 
  | 'welcome'           // ลูกค้าเดินเข้ามาในร้านค้า
  | 'shop'              // แสดงสินค้า & เลือกสินค้า
  | 'cart'              // จัดการตะกร้าสินค้า
  | 'payment'           // เลือกช่องทางการชำระเงิน
  | 'verifying'         // ตรวจสอบการชำระเงิน
  | 'receipt';          // แสดงปุ่ม “ดูรายละเอียดคำสั่งซื้อ” & สิ้นสุด

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  sheetRowSaved?: boolean;
}
