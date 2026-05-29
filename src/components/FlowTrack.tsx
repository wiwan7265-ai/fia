import React from 'react';
import { 
  User, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  Receipt 
} from 'lucide-react';
import { ScreenState } from '../types';

interface FlowTrackProps {
  currentScreen: ScreenState;
  selectedProductActive: boolean;
}

export default function FlowTrack({ currentScreen, selectedProductActive }: FlowTrackProps) {
  // Map current screen to active progression index
  let activeIndex = 0;
  if (currentScreen === 'welcome') activeIndex = 0;
  else if (currentScreen === 'shop') {
    activeIndex = selectedProductActive ? 2 : 1;
  }
  else if (currentScreen === 'cart') activeIndex = 3;
  else if (currentScreen === 'payment') activeIndex = 4;
  else if (currentScreen === 'verifying') activeIndex = 5;
  else if (currentScreen === 'receipt') activeIndex = 6;

  const steps = [
    { title: 'เดินเข้าร้าน', th: 'ลูกค้าเข้าสู่ระบบ', icon: User, desc: 'เริ่มต้น' },
    { title: 'เลือกชมสินค้า', th: 'แสดงสินค้าในร้าน', icon: ShoppingBag, desc: 'แสดงสินค้า' },
    { title: 'ดูรายละเอียด', th: 'ตรวจสอบสเปกราคา', icon: Receipt, desc: 'ดูรายละเอียด' },
    { title: 'จัดการตะกร้า', th: 'จัดการสิ่งที่จะซื้อ', icon: ShoppingCart, desc: 'ยืนยันใบสั่งซื้อ' },
    { title: 'ชำระเงิน', th: 'เลือกช่องทางจ่ายเงิน', icon: CreditCard, desc: 'เลือกช่องทาง' },
    { title: 'ตรวจการชำระ', th: 'ระบบตรวจสอบการโอน', icon: ShieldCheck, desc: 'ขั้นตอนตรวจสอบ' },
    { title: 'เสร็จสิ้น', th: 'รับรายละเอียดและใบเสร็จ', icon: ShieldCheck, desc: 'สิ้นสุดบริการ' },
  ];

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white p-4 hidden md:block">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono tracking-wider">
            APHI FLOW ENGINE v1.2
          </div>
          <div className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            สถานะปัจจุบัน: {steps[activeIndex].title}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between relative">
          <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;
            
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center relative z-10 transition-all duration-300"
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20 shadow-md scale-95' : ''}
                    ${isActive ? 'bg-indigo-600 border-indigo-400 text-white scale-110 ring-4 ring-indigo-500/20' : ''}
                    ${!isActive && !isCompleted ? 'bg-slate-950 border-slate-800 text-slate-500' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                <span className={`text-[11px] font-bold mt-2 ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {step.title}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">
                  ({step.desc})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
