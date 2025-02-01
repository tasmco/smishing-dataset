// App.tsx
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Alert} from 'react-native'; // <-- استدعاء Alert
import NetInfo from '@react-native-community/netinfo';

import {warmUpModel} from './hooks/useModel';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingScreen';

const Stack = createStackNavigator();

export default function App() {
  // إذا أردت تخزين حالة الاتصال في App.js نفسه
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 1) استدعاء دالة التهيئة (Warm Up) مرة واحدة عند تشغيل التطبيق
    warmUpModel();

    // 2) الاشتراك في تغيّر حالة الاتصال بالإنترنت
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = Boolean(state.isConnected);
      setIsOnline(connected);

      // إذا أصبح غير متصل، أظهر تنبيه
      if (!connected) {
        Alert.alert(
          'لا يوجد اتصال بالإنترنت',
          'الرجاء التحقق من الاتصال بالشبكة قبل المتابعة',
        );
      }
    });

    // تنظيف الاشتراك عند إلغاء المكوّن
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'الإعدادات'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
