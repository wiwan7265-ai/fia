import React from 'react';
import { Order } from '../types';
import { 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  FileSpreadsheet, 
  ShoppingBag, 
  Calendar, 
  UserSquare, 
  Barcode, 
  HelpCircle,
  Hash,
  Sparkles
} from 'lucide-react';

interface OrderReceiptViewProps {
  order: Order;
  userEmail: string;
  spreadsheetId: string;
  onRestart: () => void;
}

export default function OrderReceiptView({ 
  order, 
  userEmail, 
  spreadsheetId, 
  onRestart 
}: OrderReceiptViewProps) {
  
  const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return (
    <div id="receipt-view-container" className="max-w-2xl mx-auto py-8 px-4">
      
      {/* Dynamic confirmation banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">ชำระเงินสำเร็จแล้ว!</h2>
        <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
          ขอบคุณที่ไว้วางใจใช้บริการจาก Aphi Shopping
        </p>
      </div>

      {/* Digital torn receipt block layout */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl mb-8 relative">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="p-6 md:p-8">
          
          {/* Header metadata */}
          <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b border-dashed border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Order Reference
              </span>
              <span className="font-mono text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-1">
                <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                {order.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                Order Timestamp
              </span>
              <span className="text-xs text-slate-600 font-bold block">
                {order.timestamp}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-3">
              ดูรายละเอียดคำสั่งซื้อ (Order Details)
            </span>
            
            {/* Items inside digital check */}
            <div className="space-y-3.5 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-700">
                  <div className="flex-1 pr-4">
                    <span className="font-bold text-slate-900">{item.product.nameTh}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.product.name} x {item.quantity}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-mono font-bold">
                    ฿{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="border-t border-slate-200/50 pt-3.5 mt-3.5 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">ยอดชำระเบ็ดเสร็จ</span>
                <span className="text-xl font-black text-rose-500 font-mono">
                  ฿{order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details & Payment Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 mb-6 border-b border-dashed border-slate-100">
            <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                ช่องทางการชำระ (Method)
              </span>
              <span className="text-xs font-extrabold text-slate-800 uppercase">
                {order.paymentMethod === 'cod' 
                  ? 'เก็บเงินปลายทาง' 
                  : order.paymentMethod === 'bank' 
                    ? 'โอนบัญชีธนาคาร' 
                    : 'สแกนพร้อมเพย์ (QR Code)'}
              </span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                ผู้ซื้อสินค้า (User Email)
              </span>
              <span className="text-xs font-bold text-slate-500 block truncate font-mono">
                {userEmail || 'Guest Client'}
              </span>
            </div>
          </div>

          {/* GOOGLE SHEETS LIVE IN-SYNC BANNER */}
          <div className="bg-emerald-50 border border-emerald-100/50 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 items-start text-center md:text-left">
              <div className="p-2.5 bg-emerald-500 text-white rounded-xl shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  บันทึกข้อมูลสำเร็จใน Google Sheets แล้ว
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 max-w-sm">
                  ข้อมูลคำสั่งซื้อ {order.id} ได้สตรีมขึ้นสเปรดชีตเป้าหมายหลักเรียบร้อยแล้ว
                </p>
              </div>
            </div>

            <a 
              href={googleSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 transition-all shrink-0 font-sans"
            >
              <span>เปิดดูชีต</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Barcode representation */}
          <div className="mt-8 flex flex-col items-center">
            <Barcode className="w-44 h-12 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest mt-1">
              APHI-SUCCESS-KEY-{order.id}
            </span>
          </div>

        </div>
      </div>

      {/* Action to shop again */}
      <div className="text-center">
        <button
          id="btn-receipt-restart"
          onClick={onRestart}
          className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all inline-flex items-center gap-2 shadow-md hover:scale-102 duration-300"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>เริ่มต้นช้าปปิ้งสั่งซื้อสินค้าใหม่อีกครั้ง (กลับหน้าร้าน)</span>
        </button>
      </div>

    </div>
  );
}
