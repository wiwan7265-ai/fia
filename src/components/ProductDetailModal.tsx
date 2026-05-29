import React, { useState } from 'react';
import { Product } from '../types';
import ProductIcon from './ProductIcon';
import { X, Check, ShoppingBag, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [addedTemp, setAddedTemp] = useState<boolean>(false);

  const handleBuy = () => {
    onAddToCart(product, quantity);
    setAddedTemp(true);
    setTimeout(() => {
      setAddedTemp(false);
      onClose();
    }, 800);
  };

  return (
    <div 
      id="product-detail-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
        
        {/* Close Button */}
        <button 
          id="close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 p-1.5 rounded-full z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Visual Area */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-auto bg-slate-50 relative border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <ProductIcon name={product.icon} className="w-3.5 h-3.5" />
            <span>{product.category}</span>
          </div>
        </div>

        {/* Product Specifications & Buy Question Area */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">{product.nameTh}</h2>
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase mb-3">{product.name}</p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-rose-500">฿{product.price.toLocaleString()}</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">แนะขีดละสิบร้อย</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.descriptionTh}
            </p>

            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2 font-mono">
              ข้อมูลจำเพาะ / Specifications
            </h4>
            <ul className="space-y-1.5 mb-6">
              {product.specifications.map((spec, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-5">
            {/* Decide to buy? question */}
            <p className="text-sm font-bold text-slate-800 text-center mb-3">
              🤔 ตัดสินใจซื้อสินค้าชิ้นนี้ใช่หรือไม่?
            </p>

            <div className="flex gap-3">
              {/* No - กลับไปหน้าร้าน */}
              <button
                id="btn-decide-no"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200"
              >
                ไม่ซื้อ (กลับร้าน)
              </button>

              {/* Yes - ซื้อสินค้า / เพิ่มลงตะกร้า */}
              <button
                id="btn-decide-yes"
                disabled={addedTemp}
                onClick={handleBuy}
                className={`flex-[1.5] py-3 text-sm font-bold rounded-xl text-white shadow-md flex items-center justify-center gap-2 transition-all duration-200
                  ${addedTemp 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  }
                `}
              >
                {addedTemp ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    <span>เพิ่มในตะกร้าสำเร็จ!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>ซื้อสินค้า (เพิ่มลงตะกร้า)</span>
                  </>
                )}
              </button>
            </div>

            {/* Quantity Selector */}
            {!addedTemp && (
              <div className="flex items-center justify-center gap-4 mt-3.5">
                <span className="text-xs text-slate-500 font-bold">จำนวน:</span>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-800 font-mono">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
