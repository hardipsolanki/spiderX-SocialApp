import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const ChatInput = ({ value, onChangeText, onSend }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* INPUT CONTAINER */}

        <View style={styles.inputWrapper}>
          {/* INPUT */}

          <TextInput
            placeholder="Message"
            placeholderTextColor="#8696A0"
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            multiline
            maxLength={1000}
            textAlignVertical="center"
          />
        </View>

        {/* SEND BUTTON */}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!value.trim()}
          onPress={onSend}
          style={[
            styles.sendButton,
            {
              backgroundColor: value.trim() ? "#6C63FF" : "#C7D0D8",
            },
          ]}
        >
          <Ionicons name={"send"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  wrapper: {
    // backgroundColor: "#F0F2F5",
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 22 : 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  container: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  inputWrapper: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 4,
  },

  leftIcon: {
    justifyContent: "flex-end",
    paddingBottom: 6,
    marginRight: 6,
  },

  rightIcon: {
    justifyContent: "flex-end",
    paddingBottom: 6,
    marginLeft: 6,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    minHeight: 36,
    maxHeight: 100,
    paddingTop: Platform.OS === "ios" ? 8 : 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
    lineHeight: 20,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
