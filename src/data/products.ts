import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'prod-power-strip',
    name: 'Smart Surge Power Strip',
    nameTh: 'ปลั๊กไฟกันไฟกระชากสมาร์ท',
    price: 299,
    description: 'A robust 4-outlet power strip featuring built-in surge protection, overload safety breaker, and 3 high-speed USB ports. Highly durable flame-retardant casing.',
    descriptionTh: 'ปลั๊กไฟ 4 ช่องระดับพรีเมียม พร้อมระบบป้องกันไฟกระชาก เซฟตี้เบรกเกอร์ตัดไฟเกิน และพอร์ต USB Fast Charge 3 ช่อง ผลิตจากวัสดุไม่ลามไฟ แข็งแรงทนทานสูง ปลอดภัยต่อทุกคนในบ้าน',
    category: 'Electronics',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    specifications: [
      '4 AC Outlets with Safety Shutters',
      '3 USB Charging Ports (Single Max 2.4A)',
      'Surge Protection up to 350 Joules',
      'Overload Protection Breaker',
      'Cable Length: 3 Meters',
      'Max Power: 2500W, 10A'
    ]
  },
  {
    id: 'prod-shampoo',
    name: 'Herbal Essence Revitalizing Shampoo',
    nameTh: 'แชมพูสมุนไพรรีไวทัลไลซิ่ง',
    price: 129,
    description: 'Our organic blend shampoo utilizes butterfly pea essence, ginger root extracts, and high-purity oils to reduce hair fall and restore deep natural shine to your hair.',
    descriptionTh: 'แชมพูสูตรสมุนไพรออร์แกนิกเข้มข้น ผสมสารสกัดอัญชัน ขิง และน้ำมันธรรมชาติ ช่วยบำรุงลึกถึงรากผม ลดการขาดหลุดร่วง ให้เส้นผมนุ่มสลวย มีน้ำหนัก สดชื่นเบาสบายหนังศีรษะ',
    category: 'Personal Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    specifications: [
      '100% Organic Extracts',
      'Free from SLS, Parabens, and Silicones',
      'PH-Balanced for Daily Use',
      'Rich in Butterfly Pea and Ginger Root Extract',
      'Volume: 350 ml',
      'Suitable for Dry & Normal Hair Types'
    ]
  },
  {
    id: 'prod-pen',
    name: 'Premium Gel Ink Pen Set (0.5mm)',
    nameTh: 'เซ็ตปากกาเจลพรีเมียม 0.5 มม.',
    price: 25,
    description: 'An elegant writing instrument with quick-dry Japanese formulation, ultra-smooth twinball tip, and anti-slip comfortable rubberized grip. Smudge-free journaling.',
    descriptionTh: 'ปากกาเจลหัวเข็ม 0.5 มม. เขียนลื่นเป็นพิเศษด้วยหมึกสูตรแห้งไวจากญี่ปุ่น ไม่เลอะเปื้อนมือ ด้ามจับหุ้มยางนุ่มกระชับมือดีไซน์มินิมอล ช่วยลดอาการเมื่อยล้าระหว่างเขียนได้อย่างยอดเยี่ยม',
    category: 'Stationery',
    icon: 'Pen',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80',
    specifications: [
      'Tip Size: 0.5 mm Regular Fit',
      'Ink Type: Premium Waterproof Gel Ink',
      'Writing Distance: > 800 Meters',
      'Colors: Blue, Black, Red included',
      'Soft Rubber Grip Zone',
      'Retractable Design with Pocket Clip'
    ]
  },
  {
    id: 'prod-soap',
    name: 'Natural Honey & Goat Milk Soap',
    nameTh: 'สบู่น้ำผึ้งและนมแพะธรรมชาติ',
    price: 49,
    description: 'A luxurious triple-milled body soap rich in real forest honey extract and cream-infused goat milk. Restores moisture bar, leaving skin silky soft.',
    descriptionTh: 'สบู่ก้อนบำรุงผิวสูตรน้ำผึ้งแท้และนมแพะธรรมชาติ ช่วยบำรุงผิวอย่างล้ำลึก ชดเชยความชุ่มชื้น ลดอาการระคายเคือง ฟองครีมระเอียดเนียนนุ่ม กลิ่นหอมละมุนติดทนนาน ผิวดูกระจ่างใสสุขภาพดี',
    category: 'Personal Care',
    icon: 'Waves',
    imageUrl: 'https://images.unsplash.com/photo-1607006342411-1a90741cfbfa?auto=format&fit=crop&w=400&q=80',
    specifications: [
      'Wild Honey Extract & Fresh Goat Milk',
      'Deep Moisturizing Formula',
      'No Synthetic Foaming Agents',
      'Net Weight: 120 g',
      'Antibacterial Protective Layer',
      'Enriched with Vitamin E and Shea Butter'
    ]
  },
  {
    id: 'prod-toothbrush',
    name: 'Ultra-Soft Charcoal Toothbrush',
    nameTh: 'แปรงสีฟันชาร์โคลขนแปรงนุ่มพิเศษ',
    price: 59,
    description: 'Dental-engineered professional toothbrush with 0.01mm micro-fine bamboo charcoal antibacterial bristles. Gentle on gums and highly effective at plaque removal.',
    descriptionTh: 'แปรงสีฟันขนแปรงเรียวแหลมขนาด 0.01 มม. ผสมผงถ่านชาร์โคล ช่วยยับยั้งแบคทีเรีย ทำความสะอาดร่องเหงือกและซอกฟันได้อย่างหมดจด หน้าแปรงกว้าง ขนแปรงนุ่มเด้งไม่ทำร้ายเหงือก สัมผัสสบายปาก',
    category: 'Personal Care',
    icon: 'Smile',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80',
    specifications: [
      '0.01 mm Micro-fine Antibacterial Bristles',
      'Bamboo Charcoal Plaque Infusion',
      'Ergonomic Non-slip Handle',
      'Gum-line Massage Optimization',
      'Included Travel Cap'
    ]
  },
  {
    id: 'prod-toothpaste',
    name: 'Herbal White Fresh Toothpaste',
    nameTh: 'ยาสีฟันสมุนไพรไวท์เฟรช',
    price: 89,
    description: 'A natural fluoride toothpaste leveraging guava leaves, clove oils, and mint crystal extracts. Targets lasting fresh breath and natural whitening without enamel wear.',
    descriptionTh: 'ยาสีฟันสมุนไพรผสมฟลูออไรด์ 1500ppm สูตรฟื้นฟูฟันขาวและระงับกลิ่นปาก ด้วยพลังธรรมชาติจากใบฝรั่ง กานพลู และเปปเปอร์มินต์เข้มข้น ลมหายใจหอมสดชื่นยาวนาน 12 ชั่วโมง ป้องกันฟันผุรอบทิศทาง',
    category: 'Personal Care',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1559599141-3815480a827b?auto=format&fit=crop&w=400&q=80',
    specifications: [
      'Active Ingredients: Guava Extract, Clove Oil, Menthol',
      'Fluoride Concentration: 1500 ppm',
      'Anti-plaque and Enamel Safe Whitening',
      'Volume: 120 g',
      'Concentrated Formula - Only Pea-size Required'
    ]
  },
  {
    id: 'prod-socks',
    name: 'Comfy Cushion Cotton Crew Socks',
    nameTh: 'ถุงเท้าข้อยาวคอตตอนหนานุ่มพิเศษ',
    price: 99,
    description: 'A pack of 3 matching high-cotton socks with elastic ribbing, reinforced athletic heel arches, and mesh knit patterns for superior daily breathability and smell management.',
    descriptionTh: 'เซ็ตถุงเท้าข้อยาวคอตตอนแท้ 3 คู่ (คละสี) สวมใส่นุ่มสบายเท้า โครงสร้างหนาพิเศษตรงส้นและนิ้วเท้าเพื่อลดแรงกระแทก พร้อมแถบรัดซุ้มเท้ากระชับ และช่องระบายอากาศ ป้องกันกลิ่นอับและดีไซน์มินิมอลเก๋ๆ',
    category: 'Apparel',
    icon: 'Footprints',
    imageUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=400&q=80',
    specifications: [
      'Fabric Content: 85% Cotton, 12% Polyester, 3% Spandex',
      'Includes 3 Pairs (Black, Gray, White)',
      'Reinforced Heel & Toe Cushioning',
      'Arch Support Ribbing',
      'Size: Universal US Stretch (Fits UK 6-11)',
      'Enhanced Breathable Knit Top Side'
    ]
  }
];
