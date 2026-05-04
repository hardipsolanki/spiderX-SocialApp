import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

const ChatInput = () => (
  <View style={styles.inputContainer}>
    <TextInput placeholder="Type a message..." style={styles.input} />

    <TouchableOpacity style={styles.sendButton}>
      <Ionicons name="send" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default ChatInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 20,
  },
});
