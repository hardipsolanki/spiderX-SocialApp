import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatHeader = ({
  avatar,
  fullname,
  number,
  chatId,
}: {
  avatar: string;
  fullname: string;
  number: string;
  chatId: string;
}) => {
  const router = useRouter();

  const makeCall = (phoneNumber: string) => {
    const url =
      Platform.OS === "android"
        ? `tel:${phoneNumber}`
        : `telprompt:${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device.");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={styles.name}>{fullname}</Text>

      <View style={{ flexDirection: "row", marginLeft: "auto" }}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/call",
              params: { avatar, name: fullname, number, chatId },
            })
          } // Replace with actual phone number
        >
          <Feather name="video" size={22} style={styles.icon} />
        </TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={22} style={styles.icon} />
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginHorizontal: 8,
  },
});
