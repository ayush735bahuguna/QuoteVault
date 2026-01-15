import { Platform, ToastAndroid, Alert } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

/**
 * Shows a toast message on Android or an alert on iOS.
 */
export function showToast(message: string, type: ToastType = 'info') {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // On iOS, use Alert since ToastAndroid is not available
    Alert.alert(type === 'error' ? 'Error' : 'Info', message);
  }
}

/**
 * Shows a long toast message on Android.
 */
export function showLongToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
}
