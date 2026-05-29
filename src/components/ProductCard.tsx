import React from 'react';
import { Product } from '../types';
import ProductIcon from './ProductIcon';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer"
      onClick={() => onSelect(product)}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-slate-100">
          <ProductIcon name={product.icon} className="w-3.5 h-3.5 text-indigo-600" />
          <span>{product.category === 'Electronics' ? 'ไฟฟ้า' : product.category === 'Personal Care' ? 'ของใช้ส่วนตัว' : 'เครื่องเขียน'}</span>
        </div>
      </div>

      {/* Product Description Panel */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors duration-200">
            {product.nameTh}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-wide">
            {product.name}
          </p>
          <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.descriptionTh}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">ราคาพิเศษ</span>
            <span className="text-2xl font-black text-rose-500">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          <button 
            id={`btn-select-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="px-4 py-2 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
          >
            ดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}
