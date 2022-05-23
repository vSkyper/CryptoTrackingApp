import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

class Notifications {
  constructor() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'cryptoInformation',
        channelName: 'Information about crypto notifications', // (required)
        channelDescription: 'Information about crypto',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  scheduleNotification(title, message, seconds) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title,
      message,
      date: new Date(Date.now() + seconds * 1000),
    });
  }
}

export default new Notifications();
