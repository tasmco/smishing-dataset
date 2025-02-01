// src/screens/MainScreen.tsx

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {cleanText} from '../../utils/textCleaner';
import {callHuggingFaceModel} from '../../hooks/useModel';

import useAppStore from '../store/useAppStore';

export default function MainScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // نقرأ الحالة من zustand
  const isOnline = useAppStore(state => state.isOnline);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);

  // عند بدء التطبيق أو عودة المستخدم من الإعدادات
  useEffect(() => {
    // 1) إذا skipCheck === true، لا نفحص
    if (route.params?.skipCheck) {
      route.params.skipCheck = false;
      return;
    }

    // 2) إن لم يكن هناك اتصال
    if (!isOnline) return;

    // 3) تحقق إن كان هناك رسائل لم تفحص بعد
    const hasUnprocessed = messages.some(m => m.status === null);
    if (!hasUnprocessed) return;

    // 4) قم بالفحص
    async function processNewMessages() {
      try {
        const updated = await Promise.all(
          messages.map(async msg => {
            if (msg.status !== null) return msg;

            const cleaned = cleanText(msg.content);
            const result = await callHuggingFaceModel(cleaned);

            let newStatus = 'سليمة';
            if (
              Array.isArray(result) &&
              Array.isArray(result[0]) &&
              result[0].length > 0
            ) {
              const candidates = result[0];
              const bestCandidate = candidates.reduce((prev: any, curr: any) =>
                curr.score > prev.score ? curr : prev,
              );
              // 0 = سليمة, 1 = مشتبه بها
              if (bestCandidate.label === '1') {
                newStatus = 'مشتبه بها';
              }
            }
            return {...msg, status: newStatus};
          }),
        );

        // استخدم setMessages من zustand
        setMessages(updated);
      } catch (error) {
        console.error('Error processing messages:', error);
      }
    }

    processNewMessages();
  }, [messages, isOnline, route.params, setMessages]);

  // رسم العنصر الواحد
  const renderItem = ({item}: {item: any}) => (
    <View style={styles.messageContainer}>
      <Text style={styles.contentText}>{item.content}</Text>
      <Text
        style={[
          styles.statusText,
          item.status === 'مشتبه بها' && {color: 'red'},
        ]}
      >
        الحالة: {item.status ?? 'لم يتم الفحص بعد'}
      </Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.appName}>درع</Text>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text>⚙️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      {!isOnline && (
        <View style={styles.offlineAlert}>
          <Text style={styles.offlineText}>
            لا يوجد اتصال بالإنترنت حالياً.
          </Text>
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

// التنسيقات
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ececec',
    paddingHorizontal: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsIcon: {
    position: 'absolute',
    right: 15,
  },
  messageContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 15,
  },

  contentText: {
    fontSize: 20,
    marginBottom: 6,
    textAlign: 'right',
  },
  statusText: {
    fontSize: 20,
    color: 'green',
    marginBottom: 4,
    textAlign: 'right',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  offlineAlert: {
    backgroundColor: '#f8d7da',
    padding: 10,
  },
  offlineText: {
    color: '#721c24',
    textAlign: 'center',
  },
});

// src/screens/MainScreen.tsx

// import React, {useState, useEffect} from 'react';
// import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
// import {useNavigation, useRoute} from '@react-navigation/native';

// import {cleanText} from '../../utils/textCleaner';
// import {callHuggingFaceModel} from '../../hooks/useModel';

// import useAppStore from '../store/useAppStore';

// type Message = {
//   id: string;
//   content: string;
//   status: string | null;
//   time: string;
// };

// const sampleMessages: Message[] = [
//   {id: '1', content: 'مرحبا، كيف حالك؟', status: null, time: 'منذ ساعة'},
//   {id: '2', content: 'مبروك! ربحت جائزة!', status: null, time: 'منذ يوم'},
//   {
//     id: '3',
//     content: 'تهانينا مكافأة حصرية من في انتظارك يمكنك المطالبة بها هنا',
//     status: null,
//     time: 'منذ يوم',
//   },
//   {
//     id: '4',
//     content:
//       'تنبيهات بالنسبة إلى وضع الحجز الأمني الخاص بك على بطاقة التأمين ضد البطالة الخاصة بك بسبب سرقة الهوية قم بزيارة لإزالة الحجز',
//     status: null,
//     time: 'منذ يوم',
//   },
//   {
//     id: '5',
//     content:
//       'مبروك لقد ربحت مليون ريال ادخل على الرابط التالي للحصول على المبلغ',
//     status: null,
//     time: 'منذ يوم',
//   },
//   {
//     id: '6',
//     content: 'كل عام وانتم بخير',
//     status: null,
//     time: 'منذ يوم',
//   },
// ];

// export default function MainScreen() {
//   const navigation = useNavigation();
//   const route = useRoute(); // ← لقراءة params القادمة من التنقل
//   const isOnline = useAppStore(state => state.isOnline);

//   const [messages, setMessages] = useState<Message[]>(sampleMessages);

//   useEffect(() => {
//     // 1) إذا عدنا من الإعدادات بـ skipCheck=true ⇒ لا نعيد الفحص
//     if (route.params?.skipCheck) {
//       // لكي لا يمنع الفحص مرة أخرى مستقبلاً
//       route.params.skipCheck = false;
//       return;
//     }

//     // 2) إن لم يكن هناك اتصال بالإنترنت, لا نفحص
//     if (!isOnline) return;

//     // 3) إذا كل الرسائل مفحوصة, لا نفعل شيئاً
//     const hasUnprocessed = messages.some(m => m.status === null);
//     if (!hasUnprocessed) return;

//     // 4) تابع الفحص المعتاد
//     async function processNewMessages() {
//       try {
//         const updated = await Promise.all(
//           messages.map(async msg => {
//             if (msg.status !== null) return msg;

//             const cleaned = cleanText(msg.content);
//             const result = await callHuggingFaceModel(cleaned);

//             let newStatus = 'سليمة';
//             if (
//               Array.isArray(result) &&
//               Array.isArray(result[0]) &&
//               result[0].length > 0
//             ) {
//               const candidates = result[0];
//               const bestCandidate = candidates.reduce((prev: any, curr: any) =>
//                 curr.score > prev.score ? curr : prev,
//               );
//               // 0 = سليمة, 1 = مشتبه بها
//               if (bestCandidate.label === '1') {
//                 newStatus = 'مشتبه بها';
//               }
//             }

//             return {...msg, status: newStatus};
//           }),
//         );

//         setMessages(updated);
//       } catch (error) {
//         console.error('Error processing messages:', error);
//       }
//     }

//     processNewMessages();
//   }, [messages, isOnline, route.params]);

//   // دالة رسم العنصر الواحد
//   const renderItem = ({item}: {item: Message}) => (
//     <View style={styles.messageContainer}>
//       <Text style={styles.contentText}>{item.content}</Text>
//       <Text
//         style={[
//           styles.statusText,
//           item.status === 'مشتبه بها' && {color: 'red'},
//         ]}
//       >
//         الحالة: {item.status ?? 'لم يتم الفحص بعد'}
//       </Text>
//       <Text style={styles.timeText}>{item.time}</Text>
//     </View>
//   );

//   // الرأسية
//   const Header = () => (
//     <View style={styles.headerContainer}>
//       <Text style={styles.appName}>درع</Text>
//       <TouchableOpacity
//         style={styles.settingsIcon}
//         onPress={() => navigation.navigate('Settings')}
//       >
//         <Text>⚙️</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Header />

//       {!isOnline && (
//         <View style={styles.offlineAlert}>
//           <Text style={styles.offlineText}>
//             لا يوجد اتصال بالإنترنت حالياً.
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={messages}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
//     </View>
//   );
// }

// // التنسيقات
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     height: 60,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ececec',
//     paddingHorizontal: 10,
//   },
//   appName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   settingsIcon: {
//     position: 'absolute',
//     right: 15,
//   },
//   messageContainer: {
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     padding: 15,
//   },

//   contentText: {
//     fontSize: 20,
//     marginBottom: 6,
//     textAlign: 'right',
//   },
//   statusText: {
//     fontSize: 20,
//     color: 'green',
//     marginBottom: 4,
//     textAlign: 'right',
//   },
//   timeText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'right',
//   },
//   offlineAlert: {
//     backgroundColor: '#f8d7da',
//     padding: 10,
//   },
//   offlineText: {
//     color: '#721c24',
//     textAlign: 'center',
//   },
// });
