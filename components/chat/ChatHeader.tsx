import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ChatHeader = () => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <Image
        source={{ uri: "https://i.pravatar.cc/100" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Emma Wilson</Text>

      {/* <View style={{ flexDirection: "row", marginLeft: "auto" }}>
      <Feather name="video" size={22} style={styles.icon} />
      <Ionicons name="ellipsis-vertical" size={22} style={styles.icon} />
    </View> */}
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
