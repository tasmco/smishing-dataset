// hooks/useModel.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { cleanText } from '../utils/textCleaner';

/**
 * دالة لإيقاظ النموذج (Warm Up)
 */
export async function warmUpModel() {
  try {
    const modelUrl = await AsyncStorage.getItem('MODEL_URL');
    const accessToken = await AsyncStorage.getItem('ACCESS_TOKEN');
    if (!modelUrl || !accessToken) {
      throw new Error('Model URL or Access Token not found');
    }

    // نصّ قصير لإيقاظ النموذج
    const dummyText = cleanText('Ping');
    console.log('>> WarmUp Dummy Text:', dummyText); // اختياري لعرض ما يُرسل

    await fetch(modelUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: dummyText }),
    });

    console.log('Model is warmed up');
  } catch (error) {
    console.error('Error warming up model:', error);
  }
}

/**
 * الدالة الأصلية لفحص النص (استدعاء النموذج)
 */
export async function callHuggingFaceModel(rawText: string) {
  try {
    // 1) اطبع النص الأصلي قبل التنظيف
    console.log('>> Original Message (before cleaning):', rawText);

    const modelUrl = await AsyncStorage.getItem('MODEL_URL');
    const accessToken = await AsyncStorage.getItem('ACCESS_TOKEN');

    if (!modelUrl || !accessToken) {
      throw new Error('Model URL or Access Token not found');
    }

    // 2) نظّف النص
    const cleaned = cleanText(rawText);

    // 3) اطبع النص المنظف
    console.log('>> Cleaned Message (after cleaning):', cleaned);

    // 4) أرسل النص المنظّف إلى نموذج Hugging Face
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: cleaned }),
    });

    // 5) حوّل الاستجابة إلى JSON
    const result = await response.json();

    // 6) اطبع الاستجابة لمعرفة محتواها
    console.log('>> Model Response:', result);

    // 7) أعد النتيجة
    return result;
  } catch (error) {
    console.error('Error calling HuggingFace model:', error);
    throw error;
  }
}
