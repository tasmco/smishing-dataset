// screens/SettingsScreen.js

import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  // قيم الإعدادات الحالية (سنضبطها عند تحميل الشاشة)
  const [initialModelUrl, setInitialModelUrl] = useState('');
  const [initialAccessToken, setInitialAccessToken] = useState('');

  // قيم التحرير
  const [modelUrl, setModelUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');

  // حمّل القيم المخزّنة في AsyncStorage عند فتح الشاشة
  useEffect(() => {
    (async () => {
      try {
        const savedModelUrl = await AsyncStorage.getItem('MODEL_URL');
        const savedAccessToken = await AsyncStorage.getItem('ACCESS_TOKEN');

        // إن كانت القيم فارغة، اجعلها ''
        const urlVal = savedModelUrl || '';
        const tokenVal = savedAccessToken || '';

        setInitialModelUrl(urlVal);
        setInitialAccessToken(tokenVal);

        // اجعل حقول التحرير مساوية للقيم المخزّنة كي يراها المستخدم
        setModelUrl(urlVal);
        setAccessToken(tokenVal);
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    })();
  }, []);

  // زر "حفظ التغييرات"
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('MODEL_URL', modelUrl);
      await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
      // بعد الحفظ، نرجع للشاشة الرئيسية
      // (يمكنك تمرير skipCheck:false أو عدم تمريره إطلاقًا)
      navigation.navigate('Main');
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // زر "إلغاء"
  // إذا لم تتغيّر القيم عمّا كانت عليه في البداية => skipCheck: true
  // وإلا نرجع عادةً (skipCheck: false) كي تعيد الشاشة الرئيسية الفحص لو أحببت
  const handleCancel = () => {
    if (modelUrl === initialModelUrl && accessToken === initialAccessToken) {
      // لم يحدث أي تغيير
      navigation.navigate('Main', {skipCheck: true});
    } else {
      // ربما حدث تغيير ثم تراجع المستخدم
      // يمكنك إما عدم تمرير skipCheck أو تمريره بقيمة false
      navigation.navigate('Main', {skipCheck: false});
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>رابط النموذج على Hugging Face</Text>
      <TextInput
        style={styles.input}
        placeholder="https://huggingface.co/..."
        value={modelUrl}
        onChangeText={setModelUrl}
      />

      <Text style={styles.label}>مفتاح الوصول (Access Token)</Text>
      <TextInput
        style={styles.input}
        placeholder="Access Token"
        value={accessToken}
        onChangeText={setAccessToken}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="حفظ التغييرات" onPress={handleSave} />
        <Button title="إلغاء" onPress={handleCancel} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// // screens/SettingsScreen.js
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';

// export default function SettingsScreen() {
//   const navigation = useNavigation();
//   // رابط النموذج
//   const [modelUrl, setModelUrl] = useState('');
//   // مفتاح الوصول
//   const [accessToken, setAccessToken] = useState('');

//   const handleSave = async () => {
//     try {
//       await AsyncStorage.setItem('MODEL_URL', modelUrl);
//       await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
//       navigation.navigate('Main'); // الرجوع للشاشة الرئيسية
//     } catch (error) {
//       console.log('Error saving settings:', error);
//     }
//   };

//   const handleCancel = () => {
//     navigation.navigate('Main'); // الرجوع للشاشة الرئيسية دون حفظ
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>رابط النموذج على Hugging Face</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="https://huggingface.co/..."
//         value={modelUrl}
//         onChangeText={setModelUrl}
//       />

//       <Text style={styles.label}>مفتاح الوصول (Access Token)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Access Token"
//         value={accessToken}
//         onChangeText={setAccessToken}
//         secureTextEntry
//       />

//       <View style={styles.buttonContainer}>
//         <Button title="حفظ التغييرات" onPress={handleSave} />
//         <Button title="إلغاء" onPress={handleCancel} color="red" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   label: {
//     marginVertical: 8,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 8,
//     marginBottom: 12,
//     borderRadius: 5,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });
