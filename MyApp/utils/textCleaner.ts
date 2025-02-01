/**
 * utils/textCleaner.ts
 */

import {Linking} from 'react-native'; // إن احتجتَ أي شيء للروابط من React Native

// مثال بسيط لإزالة التشكيل بالعربية (Diacritics)
// لا يوجد في React Native ما يعادل مباشرة dediac_ar من camel-tools
// لكن يمكن استخدام تعابير منتظمة (Regex) للتخلص من الحركات
// (هذه قائمة مبسطة للحركات، يمكنك توسيعها بحسب الحاجة)
function removeArabicDiacritics(text: string): string {
  // مجموعة من تشكيلات الأحرف العربية الشائعة
  const arabicDiacritics = /[\u0617-\u061A\u064B-\u0652]/g;
  return text.replace(arabicDiacritics, '');
}

// إزالة وصلات (Tatweel ـ)
function removeTatweel(text: string): string {
  // الـTatweel (U+0640) نزيله
  return text.replace(/\u0640+/g, '');
}

// إزالة الروابط (Links)
function removeLinks(text: string): string {
  // يمكنك تعديل الـRegex بحسب أنواع الروابط التي ترغب بإزالتها
  const linkPattern = /(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+([\/#?]\S*)?/gi;
  return text.replace(linkPattern, '');
}

// استبدال النقاط بين الكلمات العربية بمسافة واحدة، وحذف النقاط الزائدة
function normalizeDots(text: string): string {
  // مثلاً لو لدينا "حسا ب..ينتهي.."
  // نضع مسافة واحدة بدلاً من ".." بين الكلمات
  let newText = text.replace(
    /(?<=[\u0621-\u064A])\.+(?=[\u0621-\u064A])/g,
    ' ',
  );
  // إزالة أي نقاط متكررة
  newText = newText.replace(/\.{2,}/g, '');
  // إزالة النقطة إذا لم تكن متبوعة بكلمة
  newText = newText.replace(/\.(?!\w)/g, '');
  return newText;
}

// إزالة التكرارات الحرفية مثل "ااااا"
function removeRepeatedChars(text: string): string {
  // ابحث عن أي حرف متكرر أكثر من مرتين واستبدله بحرف واحد
  return text.replace(/(.)\1{2,}/g, '$1');
}

// إزالة تكرار الكلمات بالكامل مثل "جائزتك جائزتك جائزتك"
function removeRepeatedWords(text: string): string {
  return text.replace(/\b(\w+)( \1\b)+/g, '$1');
}

// إزالة الأحرف الخاصة مع الإبقاء على الأحرف العربية والمسافات
function removeSpecialChars(text: string): string {
  return text.replace(/[^\u0621-\u064A\s]/g, '');
}

/**
 * الدالة النهائية التي تنظّف النص
 */
export function cleanText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // إزالة التشكيل
  text = removeArabicDiacritics(text);
  // إزالة وصلات ـ
  text = removeTatweel(text);
  // إزالة الروابط
  text = removeLinks(text);
  // معالجة النقاط
  text = normalizeDots(text);
  // إزالة الأرقام والأحرف الإنجليزية
  text = text.replace(/\d+/g, ''); // أزل الأرقام
  text = text.replace(/[a-zA-Z]+/g, ''); // أزل الحروف الإنجليزية
  // إزالة الأحرف الخاصة
  text = removeSpecialChars(text);
  // إزالة التكرار الحرفي
  text = removeRepeatedChars(text);
  // إزالة التكرار الكلمي
  text = removeRepeatedWords(text);
  // تقليص المسافات
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
