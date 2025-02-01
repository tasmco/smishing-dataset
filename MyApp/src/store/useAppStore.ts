// src/store/useAppStore.ts
import {create} from 'zustand';

// نوع الرسالة
type Message = {
  id: string;
  content: string;
  status: string | null;
  time: string;
};

type AppState = {
  // مثال: حالة الاتصال بالإنترنت
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;

  // الآن نضيف حالة الرسائل
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
};

// عيّنة رسائل افتراضية
const sampleMessages: Message[] = [
  {id: '1', content: 'مرحبا، كيف حالك؟', status: null, time: 'منذ ساعة'},
  {id: '2', content: 'مبروك! ربحت جائزة!', status: null, time: 'منذ يوم'},
  {
    id: '3',
    content: 'تهانينا مكافأة حصرية من في انتظارك يمكنك المطالبة بها هنا',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '4',
    content:
      'تنبيهات بالنسبة إلى وضع الحجز الأمني الخاص بك على بطاقة التأمين ضد البطالة الخاصة بك بسبب سرقة الهوية قم بزيارة لإزالة الحجز',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '5',
    content:
      'مبروك لقد ربحت مليون ريال ادخل على الرابط التالي للحصول على المبلغ',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '6',
    content: 'كل عام وانتم بخير',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '7',
    content: 'هنالك طرد بإنتظارك نرجو دفع رسوم التوصيل ',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '8',
    content: 'ادخل على الرابط التالي لتجديد بطاقة الصراف الالي',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '8',
    content: 'نعوضك عن كل المبالغ التي صرفتها',
    status: null,
    time: 'منذ يوم',
  },
  {
    id: '9',
    content: 'مبروك ربحت جائزة ادفع قيمة التوصيل',
    status: null,
    time: 'منذ يوم',
  },
];

const useAppStore = create<AppState>(set => ({
  // 1) الحالة الافتراضية
  isOnline: true,
  messages: sampleMessages,

  // 2) Actions
  setIsOnline: value => set({isOnline: value}),
  setMessages: msgs => set({messages: msgs}),
}));

export default useAppStore;

// src/store/useAppStore.ts
// import {create} from 'zustand';

// /**
//  * حددنا شكل الحالة (AppState) والإجراءات (Actions) التي نحتاجها
//  */
// type AppState = {
//   // مثال على حالة عامة: حالة الاتصال بالإنترنت
//   isOnline: boolean;

//   // إن أردت حالات إضافية، يمكن إضافتها هنا، مثل:
//   // user?: { name: string; ... };
//   // isLoading: boolean
//   // ...الخ.

//   // الإجراءات (Actions) لتحديث الحالة
//   setIsOnline: (value: boolean) => void;
// };

// /**
//  * ننشئ الـstore باستخدام zustand
//  */
// const useAppStore = create<AppState>((set, get) => ({
//   // القيم الافتراضية للحالة
//   isOnline: true, // نفترض في البداية أنه يوجد إنترنت

//   // الإجراءات
//   setIsOnline: (value: boolean) => set({isOnline: value}),
// }));

// export default useAppStore;
