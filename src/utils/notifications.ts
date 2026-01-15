import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-quotes', {
      name: 'Daily Quotes',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  // we don't need the expo push token for local notifications, but usually this is where you'd get it
  // token = (await Notifications.getExpoPushTokenAsync()).data;

  return true;
}

export async function scheduleDailyReminder(timeString: string) {
  try {
    // Ensure permissions
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission) {
      console.log('Cannot schedule notification: No permission.');
      return;
    }

    // Cancel all existing notifications first to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Parse time string "HH:MM"
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      console.log('Invalid time string for notification:', timeString);
      return;
    }

    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Quote of the Day',
        body: 'Your daily dose of inspiration is ready!',
        data: { url: '/private/(tabs)' },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
    console.log(`Notification scheduled for ${hours}:${minutes}`);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

export async function cancelNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
