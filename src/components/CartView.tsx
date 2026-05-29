import React from 'react';
import { CartItem, Product } from '../types';
import ProductIcon from './ProductIcon';
import { ArrowLeft, Trash2, ShieldCheck, ShoppingCart, Info, ShoppingBag } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onConfirmOrder: (confirmed: boolean) => void;
}

export default function CartView({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onConfirmOrder 
}: CartViewProps) {
  
  const totalPrice = cart.reduce((accumulator, item) => {
    return accumulator + (item.product.price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div id="cart-view-empty" className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">ตะกร้าของคุณว่างเปล่า</h2>
        <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
          ยังไม่ได้เลือกสินค้าเพื่อสั่งซื้อเลย เดินกลับไปเลือกชมสินค้าในร้านเพื่อเลือกสินค้าที่ต้องการได้นะคะ
        </p>
        <button
          id="btn-back-to-shop-empty"
          onClick={() => onConfirmOrder(false)}
          className="px-6 py-3 bg-slate-900 hover:bg-indigo-600 font-bold text-sm text-white rounded-xl transition-all duration-300"
        >
          กลับไปหน้าร้านค้า (เลือกสินค้า)
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view-container" className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">จัดการตะกร้าสินค้า ({cart.length} รายการ)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item Lists */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.product.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate text-sm md:text-base">
                  {item.product.nameTh}
                </h3>
                <p className="text-xs text-slate-400 mb-2 font-mono truncate">{item.product.name}</p>
                <div className="text-xs text-slate-400 font-bold block mb-1">
                  ชิ้นละ ฿{item.product.price.toLocaleString()}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                {/* Quantity adjustments */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs font-black"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-800 font-mono">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs font-black"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal tag */}
                <div className="text-sm font-bold text-slate-900 w-20 text-right font-mono">
                  ฿{(item.product.price * item.quantity).toLocaleString()}
                </div>

                {/* Remove trigger */}
                <button 
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Confirm Box */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-slate-900 text-base mb-4 pb-2 border-b border-slate-200/80">
            สรุปรายการสั่งซื้อ
          </h3>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs text-slate-500">
              <span>ราคาสินค้ารวม ({cart.reduce((s, i) => s + i.quantity, 0)} ชิ้น)</span>
              <span className="font-mono">฿{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>ค่าจัดส่ง</span>
              <span className="text-emerald-500 font-bold">ฟรี</span>
            </div>
            <div className="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-800">ยอดชำระสุทธิ</span>
              <span className="text-2xl font-black text-rose-500 font-mono">
                ฿{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-100/60 p-3.5 rounded-xl border border-slate-200/40 mb-6 flex gap-2">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-slate-500 leading-normal">
              กรุณาตรวจสอบจำนวนสินค้าก่อนยืนยันคำสั่งซื้อเพื่อไปยังความประสงค์การเลือกชำระเงินต่อไป
            </span>
          </div>

          <div className="border-t border-slate-200 pt-5 text-center">
            {/* flowchart decision: ยืนยันคำสั่งซื้อ? */}
            <p className="text-xs font-extrabold text-slate-700 mb-3.5 block">
              ❓ ยืนยันคำสั่งซื้อสินค้าหรือไม่?
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Yes -> เลือกช่องทางการชำระเงิน */}
              <button
                id="btn-confirm-order-yes"
                onClick={() => onConfirmOrder(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ยืนยัน (เลือกช่องทางการชำระเงิน)</span>
              </button>

              {/* No -> กลับไปหน้าร้านค้า */}
              <button
                id="btn-confirm-order-no"
                onClick={() => onConfirmOrder(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                ไม่ยืนยัน (กลับหน้าร้าน)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
