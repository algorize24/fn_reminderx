import {
  StyleSheet,
  FlatList,
  View,
  Alert,
  Platform,
  Linking,
  Modal,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";

// constants
import { Color } from "../../constants/Color";
import { Fonts } from "../../constants/Font";

// components
import Userprofile from "../../components/dashboard/Userprofile";
import HealthOverview from "../../components/dashboard/HealthOverview";
import NewsArticle from "../../components/dashboard/NewsArticle";

// notification
import * as Notifications from "expo-notifications";

// import Calendar for calendar access
import * as Calendar from "expo-calendar";

// connection of android and ios
import { android_url, ios_url } from "../../constants/Url";

// firebase
import { auth } from "../../firebase/firebase";

// context
import { useAuth } from "../../context/authContext";
import { useNotification } from "../../context/notificationContext";

// axios
import axios from "axios";

// icons
import AntDesign from "@expo/vector-icons/AntDesign";

// notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// connection path
const connection =
  Platform.OS === "android" ? `${android_url}/user` : `${ios_url}/user`;

export default function DashboardScreen({ navigation }) {
  // context
  const { user } = useAuth();
  const { expoPushToken, notification, error } = useNotification();

  if (error) {
    return <Text>{error.message}</Text>;
  }

  console.log(expoPushToken);
  console.log(notification?.request.content.title);
  console.log(JSON.stringify(notification?.request.content.data, null, 2));
  if (user) {
    console.log("authenticated");
  } else {
    console.log("not authenticated");
  }

  // state to store calendar permission status
  const [calendarPermission, setCalendarPermission] = useState(false);

  useEffect(() => {
    // check and request Calendar permission only if it's not already granted
    checkCalendarPermission();
  }, []);

  // check the current Calendar permission status
  const checkCalendarPermission = async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();

    if (status === "granted") {
      setCalendarPermission(true); // Set permission state to granted
    } else {
      // If permission is not granted, request permission
      requestCalendarPermission();
    }
  };

  // request Calendar permissions and handle syncing
  const requestCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === "granted") {
      setCalendarPermission(true); // Set permission state to granted
      Alert.alert("Success", "Calendar access granted and synced.");
    } else {
      setCalendarPermission(false); // Set permission state to denied
      Alert.alert("Permission Denied", "Calendar access is required to sync.", [
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  // send the expoPushToken to backend
  const saveExpoPushToken = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken();

        // send push token to backend
        if (user && expoPushToken) {
          try {
            const response = await axios.post(
              `${connection}/token`,
              {
                expoPushToken,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            console.log("sending expo token to backend:", expoPushToken);
          } catch (error) {
            console.log(
              "An unexpected error occur when sending the push token to backend",
              error
            );
          }
        }
      }
    } catch (error) {
      console.log("Error for user and expo-push-token:", error);
    }
  };

  // call the saveExpoPushToken
  useEffect(() => {
    if (expoPushToken) {
      saveExpoPushToken();
    }
  }, [expoPushToken]);

  // handle notification tap
  const notificationResponseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      if (data && data.screen) {
        navigation.navigate(data.screen);
      }
    });

  useEffect(() => {
    return () => {
      notificationResponseListener.remove();
    };
  });

  // state for modal
  const [modalVisible, setModalVisible] = useState(true);

  // avoid virtualizedLists error
  const sections = [
    { key: "UserProfile", component: <Userprofile /> },
    { key: "HealthOverview", component: <HealthOverview /> },
    { key: "NewsArticle", component: <NewsArticle /> },
  ];

  return (
    <>
      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              style={styles.img}
              source={require("../../assets/feature/main_features.png")}
            />
            <Text style={styles.modal_header}>
              Reminde<Text style={styles.rx}>Rx</Text>
            </Text>
            <Text style={styles.modal_description}>
              Welcome to ReminderRx! Your personalized medication reminder
              assistant. Stay on top of your health with easy-to-use reminders,
              medication tracking, and more!
            </Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.modal_close}
          >
            <AntDesign name="closecircleo" size={30} color="#fff" />
          </Pressable>
        </View>
      </Modal>

      <FlatList
        overScrollMode="never"
        bounces={false}
        style={styles.root}
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <View>{item.component}</View>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.bgColor,
    paddingHorizontal: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Color.bgColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  modal_close: {
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 25,
  },

  modal_header: {
    textAlign: "center",
    fontFamily: Fonts.main,
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },

  rx: {
    color: Color.purpleColor,
  },

  modal_description: {
    fontFamily: Fonts.sub,
    color: "#fff",
    textAlign: "center",
    fontSize: 11,
    paddingHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 10,
  },

  img: {
    width: "screen",
    height: 510,
    resizeMode: "cover",

    borderRadius: 25,
    marginHorizontal: Platform.OS === "android" ? 0 : 20,
  },
});
