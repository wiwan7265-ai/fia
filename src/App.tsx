import React, { useState, useEffect } from 'react';
import { 
  CartItem, 
  Product, 
  ScreenState, 
  Order, 
  PaymentMethod 
} from './types';
import { products } from './data/products';
import { 
  initAuth, 
  googleSignIn, 
  logout 
} from './services/authService';
import { 
  appendOrderToSheet, 
  verifySpreadsheetAccess 
} from './services/sheetsService';

// Import components
import FlowTrack from './components/FlowTrack';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartView from './components/CartView';
import PaymentView from './components/PaymentView';
import OrderReceiptView from './components/OrderReceiptView';

// Icons
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Store, 
  AlertCircle, 
  Smartphone, 
  MapPin, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const SPREADSHEET_ID = '1YZu3I0QyzfCDHkg3XxnDSYGKq3FOTvPmge0cX9gCSgk';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Authentication State
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>('');
  
  // Google Sheets state
  const [sheetsConnected, setSheetsConnected] = useState<boolean>(false);
  const [savingToSheet, setSavingToSheet] = useState<boolean>(false);

  // Auto-authentication effect on mount
  useEffect(() => {
    initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setAuthChecking(false);
        checkSheetsAccess(token);
      },
      () => {
        setAuthChecking(false);
      }
    );
  }, []);

  const checkSheetsAccess = async (token: string) => {
    const works = await verifySpreadsheetAccess(SPREADSHEET_ID, token);
    setSheetsConnected(works);
  };

  const handleSignIn = async () => {
    setAuthError('');
    try {
      const response = await googleSignIn();
      if (response) {
        setUser(response.user);
        setAccessToken(response.accessToken);
        await checkSheetsAccess(response.accessToken);
      }
    } catch (error: any) {
      console.error('Sign-in failed', error);
      setAuthError('ไม่สามารถเข้าสู่ระบบผ่าน Google ได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setSheetsConnected(false);
    setScreen('welcome');
    setCart([]);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // decision: ยืนยันคำสั่งซื้อหรือไม่?
  const handleConfirmOrder = (confirmed: boolean) => {
    if (confirmed) {
      setScreen('payment');
    } else {
      setScreen('shop'); // กลับไปหน้าร้านค้า
    }
  };

  // process: ตรวจสอบการชำระเงินสำเร็จหรือไม่?
  const handlePaymentOutcome = async (method: PaymentMethod, success: boolean, remarks: string) => {
    if (!success) {
      // If failure, PaymentView internally handles showing the notify-to-repay warning.
      return;
    }

    // Generate dynamic unique order id
    const orderId = `APHI-O-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const thaiTimestamp = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newOrder: Order = {
      id: orderId,
      items: cart,
      totalPrice: currentPrice,
      paymentMethod: method,
      status: 'success',
      timestamp: thaiTimestamp,
    };

    setActiveOrder(newOrder);
    if (method !== 'cod') {
      setScreen('verifying'); // Show verify screening progress animation before finally completing
    }

    // Prepack row variables for Google Sheets
    // Columns: [Timestamp, OrderID, Email, Ordered Items, Total Price, Payment Method, Status, Remarks]
    const productSummary = cart.map(item => `${item.product.nameTh} x${item.quantity}`).join(', ');
    const sheetRow = [
      thaiTimestamp,
      orderId,
      user?.email || 'Guest @wiwan',
      productSummary,
      currentPrice,
      method === 'cod' ? 'เก็บเงินปลายทาง' : method === 'bank' ? 'โอนบัญชีธนาคาร' : 'พร้อมเพย์ / QR Code',
      'ชำระเงินสำเร็จ',
      remarks
    ];

    setSavingToSheet(true);
    let saved = false;
    
    if (accessToken) {
      saved = await appendOrderToSheet(SPREADSHEET_ID, accessToken, sheetRow);
    } else {
      console.warn('Cannot append to sheet: Access token unavailable');
    }

    setSavingToSheet(false);
    
    if (method === 'cod') {
      // สำหรับชำระเงินปลายทาง ไปที่หน้าเสร็จสิ้นทันทีโดยไม่ต้องผ่านหน้าจำลองตรวจสอบสลิป
      setActiveOrder(prev => prev ? { ...prev, sheetRowSaved: saved } : null);
      setScreen('receipt');
      setCart([]); // ล้างตะกร้าสินค้า
    } else {
      // สำหรับสแกนพร้อมเพย์หรือโอนผ่านธนาคาร จะทำการรอดำเนินการสุ่มผลลัพธ์จำลองก่อนเพื่อความสมบูรณ์
      setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, sheetRowSaved: saved } : null);
        setScreen('receipt');
        setCart([]); // Clear cart upon successful order
      }, 1800);
    }
  };

  const handleRestart = () => {
    setActiveOrder(null);
    setScreen('shop');
  };

  const totalCartCount = cart.reduce((sums, item) => sums + item.quantity, 0);
  const totalCartValue = cart.reduce((sums, item) => sums + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      
      {/* 1. App Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setScreen('welcome')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700 transition-all duration-300">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
                <span>Aphi Shopping</span>
                <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">เอฟิ</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">สะดวกซื้อระดับพรีเมียม</p>
            </div>
          </div>

          {/* Right Utilities Area */}
          <div className="flex items-center gap-4">
            
            {/* Sheet sync green dot */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-500">
                <FileSpreadsheet className={`w-3.5 h-3.5 ${sheetsConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span>{sheetsConnected ? 'Google Sheets Sync ทำงาน (เชื่อมต่อแล้ว)' : 'กำลังขอสิทธิ์ชีต'}</span>
              </div>
            )}

            {/* Profile Detail badge */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full py-1 pl-1.5 pr-2.5">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt={user.displayName || 'Me'} 
                  className="w-6 h-6 rounded-full border border-white"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] font-extrabold text-slate-700 max-w-[80px] truncate hidden md:block">
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  title="ออกจากระบบ"
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              !authChecking && (
                <button 
                  onClick={handleSignIn}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ Google</span>
                </button>
              )
            )}

            {/* Floating Mini Cart */}
            {screen === 'shop' && (
              <button 
                id="btn-nav-to-cart"
                onClick={() => setScreen('cart')}
                className="p-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 rounded-xl relative transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>
      </header>

      {/* 2. Flow Diagram Progress Line */}
      <FlowTrack currentScreen={screen} selectedProductActive={selectedProduct !== null} />

      {/* 3. Primary App View Panel */}
      <main className="flex-1 w-full flex flex-col justify-center">

        {/* 3.1 WELCOME (ลูกค้าเดินเข้ามาในร้านค้า) */}
        {screen === 'welcome' && (
          <div id="screen-welcome" className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
            
            {/* Elegant Welcome Hero Banner */}
            <div className="mb-8 relative max-w-sm mx-auto">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" 
                alt="Welcome Store Entrance" 
                className="w-48 h-48 object-cover rounded-full mx-auto border-4 border-white shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 right-1/4 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>OPEN NOW</span>
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              ยินดีต้อนรับสู่ <span className="text-indigo-600">Aphi Shopping</span> 🛍️
            </h2>
            <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-8 font-medium">
              ร้านขายสินค้าอำนวยความสะดวกพรีเมียม ที่รวบรวมของใช้คุณภาพสูง สำหรับใช้ในชีวิตประจำวันของทุกคน มีความสุขและคุ้มค่าในทุกก้าวเดิน
            </p>

            {/* Google Synchronization Prompt Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-lg mx-auto mb-8 text-left">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 font-mono">
                Google Sheets Integration Panel
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                เพื่อรองรับการซิงค์ประวัติใบสั่งซื้อลง <b>สเปรดชีต</b> ของคุณที่ลิงก์ไว้โดยตรง กรุณากดเข้าสู่ระบบ Google ด้านล่างก่อนเริ่มสั่งซื้อสินค้า
              </p>

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {user ? (
                <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={user.photoURL} 
                      alt="User Pic" 
                      className="w-9 h-9 rounded-full border border-white shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{user.displayName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{user.email}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-white font-extrabold text-[9px] py-1 px-2 rounded-full">
                    เชื่อมต่อแล้ว
                  </span>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 border border-transparent shadow shadow-slate-950/10"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>เข้าสู่ระบบด้วยบัญชี Google เพื่อร่วมซิงค์สเปรดชีต</span>
                </button>
              )}
            </div>

            {/* FLOW ACTION: ลูกค้าเดินเข้ามาในร้านค้า */}
            <button
               id="btn-walk-into-shop"
               onClick={() => setScreen('shop')}
               className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 transition-all inline-flex items-center gap-2 group"
            >
              <span>เดินเข้าสู่ร้านค้า (Walk into Shop)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

          </div>
        )}

        {/* 3.2 SHOW PRODUCTS (แสดงสินค้า & เลือกสินค้า) */}
        {screen === 'shop' && (
          <div id="screen-shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">สินค้าในร้านค้ายอดนิยม</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  ยินดีต้อนรับ! เลือกคลิกสินค้าที่คุณพึงพอใจเพื่อดูรายละเอียดและสั่งซื้อ
                </p>
              </div>
              <div className="bg-white px-4 py-2 border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between md:justify-end gap-6 text-xs text-slate-500 font-bold">
                <span>แสดงทั้งหมด: <strong className="text-slate-900">{products.length} ผลิตภัณฑ์</strong></span>
                {totalCartCount > 0 && (
                  <button 
                    onClick={() => setScreen('cart')}
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-extrabold"
                  >
                    ตะกร้า ({totalCartCount} ชิ้น - ฿{totalCartValue.toLocaleString()})
                  </button>
                )}
              </div>
            </div>

            {/* The 7 Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onSelect={(p) => setSelectedProduct(p)} 
                />
              ))}
            </div>

            {/* PRODUCT DETAIL MODAL (ดูรายละเอียดสินค้า - ตัดสินใจซื้อหรือไม่? -> ไม่ซื้อ / ซื้อสินค้า(เพิ่มตะกร้า)) */}
            {selectedProduct && (
              <ProductDetailModal 
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(p, qty) => handleAddToCart(p, qty)}
              />
            )}
          </div>
        )}

        {/* 3.3 CART (จัดการตะกร้าสินค้า - เพิ่มจำนวน / ลบสินค้า - ยืนยันคำสั่งซื้อ?) */}
        {screen === 'cart' && (
          <div id="screen-cart">
            <CartView 
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        )}

        {/* 3.4 PAYMENT SELECTION & RETRY (เลือกเงินยอดจ่าย - เก็บปลายทาง / โอน / พร้อมเพย์) */}
        {screen === 'payment' && (
          <div id="screen-payment">
            <PaymentView 
              totalPrice={totalCartValue}
              cart={cart}
              onBack={() => setScreen('cart')}
              onPaymentResult={handlePaymentOutcome}
            />
          </div>
        )}

        {/* 3.5 VERIFYING LOADING SIMULATION */}
        {screen === 'verifying' && (
          <div id="screen-verifying" className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-dashed border-indigo-600 rounded-full animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">กำลังตรวจสอบระบบ...</h3>
              <p className="text-xs text-slate-400 mt-2">
                ผู้ตรวจสอบยอดกำลังบันทึกข้อมูลและแนบสลิปของคุณลง Google Sheets...
              </p>
            </div>
          </div>
        )}

        {/* 3.6 ORDER RECEIPT (แสดงปุ่ม “ดูรายละเอียดคำสั่งซื้อ” -> สิ้นสุด) */}
        {screen === 'receipt' && activeOrder && (
          <div id="screen-receipt">
            <OrderReceiptView 
              order={activeOrder}
              userEmail={user?.email || 'ลูกค้า Aphi Shopping'}
              spreadsheetId={SPREADSHEET_ID}
              onRestart={handleRestart}
            />
          </div>
        )}

      </main>

      {/* 4. Humble Footer */}
      <footer className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 leading-normal">
          <p>© {new Date().getFullYear()} Aphi Shopping (เอฟิ ช้อปปิ้ง). สงวนลิขสิทธิ์ความสะดวกสบาย.</p>
          <div className="flex gap-4">
            <span>สเปรดชีตเก็บข้อมูล: <a href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline font-mono">{SPREADSHEET_ID.substring(0,6)}...</a></span>
            <span className="hidden sm:inline">|</span>
            <span>ขับเคลื่อนโดย React + Google Sheets API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
