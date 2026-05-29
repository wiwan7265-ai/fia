import React, { useState } from 'react';
import { PaymentMethod, CartItem } from '../types';
import { 
  CreditCard, 
  Truck, 
  QrCode, 
  Building, 
  ArrowLeft, 
  Check, 
  Clock, 
  Loader2, 
  AlertCircle, 
  FileUp, 
  Info 
} from 'lucide-react';

interface PaymentViewProps {
  totalPrice: number;
  cart: CartItem[];
  onBack: () => void;
  onPaymentResult: (method: PaymentMethod, success: boolean, remarks: string) => void;
}

export default function PaymentView({ 
  totalPrice, 
  cart, 
  onBack, 
  onPaymentResult 
}: PaymentViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('promptpay');
  const [paymentStep, setPaymentStep] = useState<'selection' | 'verifying' | 'failed_screen'>('selection');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Custom mock values for bank receipts
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [transferTime, setTransferTime] = useState<string>('');

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setErrorMessage('');
  };

  const handleRequestVerify = () => {
    if (selectedMethod === 'cod') {
      onPaymentResult('cod', true, 'เก็บเงินปลายทางตอนรับสินค้า');
      return;
    }
    if ((selectedMethod === 'bank' || selectedMethod === 'promptpay') && !slipImage && !transferTime) {
      // Prompt user to provide some fake receipt info for better interactive simulation, but don't hard block them
      setTransferTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.');
    }
    setPaymentStep('verifying');
  };

  const executeOutcome = (success: boolean) => {
    if (success) {
      // Successful payment - pass parameters
      const remarks = selectedMethod === 'cod' 
        ? 'เก็บเงินปลายทางตอนรับสินค้า' 
        : `โอนสำเร็จ (เมื่อเวลา ${transferTime || 'ปัจจุบัน'})`;
      onPaymentResult(selectedMethod, true, remarks);
    } else {
      // Failed payment - enter notify-to-repay screen
      setErrorMessage('❌ แจ้งเตือน: ระบบไม่พบการโอนเงินหรือสลิปของท่าน หรือรหัสสลิปซ้ำซ้อน กรุณาตรวจสอบยอดเงินและชำระเงินใหม่อีกครั้ง');
      setPaymentStep('failed_screen');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSlipImage(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlipImage(e.target.files[0].name);
    }
  };

  return (
    <div id="payment-view-container" className="max-w-3xl mx-auto py-8 px-4">
      
      {/* 1. SELECTION STATE */}
      {paymentStep === 'selection' && (
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปจัดการตะกร้า</span>
          </button>

          <h2 className="text-2xl font-black text-slate-900 mb-1">เลือกช่องทางการชำระเงิน</h2>
          <p className="text-sm text-slate-400 mb-8 font-medium">
            ยอดเงินที่ต้องชำระทั้งหมด: <span className="text-rose-500 font-extrabold font-mono text-base">฿{totalPrice.toLocaleString()}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 1. PromtPay */}
            <div 
              id="pay-opt-promptpay"
              onClick={() => handleSelectMethod('promptpay')}
              className={`border-2 rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-44 transition-all duration-200
                ${selectedMethod === 'promptpay' 
                  ? 'border-indigo-600 bg-indigo-50/20' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <QrCode className="w-6 h-6" />
                </div>
                {selectedMethod === 'promptpay' && (
                  <span className="bg-indigo-600 text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm">พร้อมเพย์ / QR Code</h4>
                <p className="text-xs text-slate-400 mt-1">สแกนชำระเงินทันตาผ่าน Mobile Banking</p>
              </div>
            </div>

            {/* 2. Bank Transfer */}
            <div 
              id="pay-opt-bank"
              onClick={() => handleSelectMethod('bank')}
              className={`border-2 rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-44 transition-all duration-200
                ${selectedMethod === 'bank' 
                  ? 'border-indigo-600 bg-indigo-50/20' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Building className="w-6 h-6" />
                </div>
                {selectedMethod === 'bank' && (
                  <span className="bg-indigo-600 text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm">โอนผ่านธนาคาร</h4>
                <p className="text-xs text-slate-400 mt-1">มีหลายธนาคารรองรับและอัปสลิปแมนนวล</p>
              </div>
            </div>

            {/* 3. Cash on Delivery */}
            <div 
              id="pay-opt-cod"
              onClick={() => handleSelectMethod('cod')}
              className={`border-2 rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-44 transition-all duration-200
                ${selectedMethod === 'cod' 
                  ? 'border-indigo-600 bg-indigo-50/20' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Truck className="w-6 h-6" />
                </div>
                {selectedMethod === 'cod' && (
                  <span className="bg-indigo-600 text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-950 text-sm">เก็บเงินปลายทาง (COD)</h4>
                <p className="text-xs text-slate-400 mt-1">เตรียมเงินชำระหน้าบ้านตอนจัดรับของ</p>
              </div>
            </div>
          </div>

          {/* Conditional Instructions Inner Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-8">
            {selectedMethod === 'promptpay' && (
              <div id="instruction-promptpay" className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-white p-3 border border-slate-100 rounded-xl flex flex-col items-center shrink-0">
                  <div className="bg-[#103460] text-white font-extrabold text-[10px] py-1 px-4 rounded mb-2 font-mono tracking-wider">
                    PROMPTPAY
                  </div>
                  {/* Mock promptpay QR visual */}
                  <div className="w-32 h-32 border border-slate-100 flex items-center justify-center bg-slate-50 relative">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[0.5px]">
                      <span className="bg-emerald-500 font-black text-[10px] text-white px-2 py-0.5 rounded shadow">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] text-indigo-600 font-bold mt-2">Aphi Shop PromptPay App</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm mb-1.5">วิธีสแกนรับเงินด่วน</h4>
                  <ol className="text-xs text-slate-500 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>เปิดแอปธนาคารบนมือถือของท่าน</li>
                    <li>เลือกฟังก์ชั่น "สแกนจ่าย / QR Code"</li>
                    <li>สแกนรหัสคิวอาร์โค้ดจากหน้านี้ ยอดเงินจะฟลักซ์อัตโนมัติ</li>
                    <li>เมื่อชำระสำเร็จ กรุณาแนบชื่อสลิปหรือระบุช่วงเวลาด้านล่าง</li>
                  </ol>
                  
                  {/* Mock Upload container */}
                  <div className="mt-4 flex gap-3">
                    <div className="flex-1 max-w-xs">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">ระบุเวลาโอนโดยประมาณ</label>
                      <input 
                        type="text" 
                        placeholder="เช่น 15:30 น." 
                        value={transferTime}
                        onChange={(e) => setTransferTime(e.target.value)}
                        className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white bg-slate-50/30 text-slate-700 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">อัปสลิป (ลากมาวางที่นี่)</label>
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border border-dashed border-slate-300 rounded-lg py-2.5 px-3 bg-white hover:bg-slate-50 text-center cursor-pointer relative"
                      >
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-[10px] font-semibold text-indigo-500 flex items-center justify-center gap-1">
                          <FileUp className="w-3.5 h-3.5" />
                          {slipImage ? (
                            <span className="text-emerald-500 font-bold truncate max-w-[120px]">{slipImage}</span>
                          ) : 'เลือกสลิปชำระเงิน'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'bank' && (
              <div id="instruction-bank">
                <h4 className="font-bold text-slate-800 text-sm mb-3">บัญชีธนาคารเครื่องรับโอน</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                      KBANK
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ธนาคารกสิกรไทย</span>
                      <span className="font-extrabold text-slate-800 text-sm font-mono block">789-2-34567-1</span>
                      <span className="text-xs text-slate-500 font-semibold block">บจก. เอฟิ ช้อปปิ้ง พรีเมียร์</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-700 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                      SCB
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ธนาคารไทยพาณิชย์</span>
                      <span className="font-extrabold text-slate-800 text-sm font-mono block">109-8-76543-2</span>
                      <span className="text-xs text-slate-500 font-semibold block">บจก. เอฟิ ช้อปปิ้ง พรีเมียร์</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4 mt-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ระบุเวลาโอนตามสลิป</label>
                    <input 
                      type="text" 
                      placeholder="เช่น 15:30 น." 
                      value={transferTime}
                      onChange={(e) => setTransferTime(e.target.value)}
                      className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">อัปสลิป (ลากมาวางที่นี่)</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border border-dashed border-slate-300 rounded-lg py-2.5 px-3 bg-white hover:bg-slate-50 text-center cursor-pointer relative"
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-indigo-500 flex items-center justify-center gap-1">
                        <FileUp className="w-3.5 h-3.5" />
                        {slipImage ? (
                          <span className="text-emerald-500 font-bold truncate max-w-[150px]">{slipImage}</span>
                        ) : 'เลือกสลิปการโอนเงินคู่ฝัก'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'cod' && (
              <div id="instruction-cod" className="flex gap-4 items-start">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">ข้อตกลงการเก็บปลายทาง (COD)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ท่านชำระค่าสินค้าทั้งหมดจำนวน <span className="font-bold text-slate-800">฿{totalPrice.toLocaleString()}</span> ให้แก่เจ้าหน้าที่จัดส่งพัสดุเป็นเงินสดตอนรับสินค้าเท่านั้น ไม่มีบวกค่าบริการเพิ่มเติม กรุณาเตรียมเงินสดให้พร้อมและรอรับโทรศัพท์ยืนยันที่อยู่จัดส่งสินค้าจากเจ้าหน้าที่ขนส่ง
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Primary Submit Button -> ตรวจสอบการชำระเงิน */}
          <button
            id="btn-payment-action-verify"
            onClick={handleRequestVerify}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
          >
            <span>ดำเนินการตรวจสอบยอดเงินชำระ (ดำเนินการต่อ)</span>
          </button>
        </div>
      )}

      {/* 2. VERIFYING SIMULATOR STATE */}
      {paymentStep === 'verifying' && (
        <div className="py-12 px-6 text-center bg-white border border-slate-100 rounded-3xl shadow-xl max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-55 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">ตรวจสอบการชำระเงิน</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            ระบบกำลังทำหน้าที่ตรวจสอบสลิปการโอนและยอดเงินในบัญชีเป้าหมายของทาง เอฟิ ช้อปปิ้ง กรุณาอย่าปิดหน้านี้...
          </p>

          <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-left mb-8 text-xs font-mono">
            <span className="text-slate-400 block mb-1">Logs:</span>
            <span className="text-slate-500 block">Connecting core banking gateway... Done</span>
            <span className="text-slate-500 block">Resolving sheet row parameters... Done</span>
            <span className="text-slate-500 block">Total expected: ฿{totalPrice.toLocaleString()}</span>
            <span className="text-amber-500 font-bold block animate-pulse">Awaiting manual operator verification...</span>
          </div>

          {/* Flow Diagram decision: ชำระเงินสำเร็จหรือไม่? */}
          <div className="border-t border-slate-100 pt-6">
            <p className="text-xs font-black text-slate-700 mb-4 block">
              💡 จำลองผลลัพธ์การตรวจสอบการโอน เพื่อทดสอบทั้งสองกิ่งของโฟลว์ชาร์ตของคุณ:
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 2: Payment Fail (ชำระเงินไม่สำเร็จ -> แจ้งให้ชำระใหม่) */}
              <button 
                id="btn-simulate-fail"
                onClick={() => executeOutcome(false)}
                className="py-3 bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors"
              >
                โอนไม่สำเร็จ (ขัดข้อง)
              </button>

              {/* Option 1: Payment Success (ชำระเงินสำเร็จ -> แสดงปุ่ม ดูรายละเอียด) */}
              <button 
                id="btn-simulate-success"
                onClick={() => executeOutcome(true)}
                className="py-3 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/15 hover:bg-emerald-600 transition-all"
              >
                โอนสำเร็จ (สมบูรณ์)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RETRY / FAILED STATE (แจ้งให้ชำระใหม่) */}
      {paymentStep === 'failed_screen' && (
        <div className="py-12 px-6 bg-rose-50/50 border border-rose-100 rounded-3xl max-w-md mx-auto text-center shadow-lg">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-rose-600 mb-2">การชำระเงินไม่สำเร็จ</h3>
          <p className="text-xs text-rose-500 mb-6 leading-relaxed">
            {errorMessage || 'ระบบไม่สามารถยืนยันยอดเงินจัดโอนของสลิปที่แนบมาได้'}
          </p>

          <div className="bg-white rounded-2xl border border-rose-100 p-4 mb-6 text-left">
            <div className="flex gap-2 items-start text-slate-600">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="text-xs leading-normal">
                <span className="font-bold text-slate-800">วิธีแก้ไข:</span>
                <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-500 space-y-1">
                  <li>ตรวจสอบให้มั่นใจว่าจำนวนเงินจัดโอนตรงกับความต้องการ</li>
                  <li>หากสแกนแล้วเงินตัดแล้ว ลองแจ้งใหม่อีกรอบ</li>
                  <li>เลือกช่องทางการชำระเงิบเป็น <b>เก็บปลายทาง</b> เพื่อเลี่ยงปัญหา</li>
                </ul>
              </div>
            </div>
          </div>

          {/* flowchart branch: แจ้งให้ชำระใหม่ */}
          <button
            id="btn-repay-retry"
            onClick={() => setPaymentStep('selection')}
            className="w-full py-3 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>แจ้งชำระใหม่ (กลับหน้าเลือกชำระเงิน)</span>
          </button>
        </div>
      )}
    </div>
  );
}
