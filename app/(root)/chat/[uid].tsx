import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { clearChat, sendMessage } from "@/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const messages = [
  {
    id: "1",
    text: "Hi John!\nThanks for connecting.",
    type: "received",
    time: "10:30 AM",
  },
  {
    id: "2",
    text: "Hi Emma! Nice to connect with you too.",
    type: "sent",
    time: "10:31 AM",
  },
  {
    id: "3",
    text: "How's your day going?",
    type: "received",
    time: "10:31 AM",
  },
  {
    id: "4",
    text: "Going great! Working on an exciting project.",
    type: "sent",
    time: "10:31 AM",
  },
  {
    id: "46",
    text: "Going great! Working on an exciting project.",
    type: "sent",
    time: "10:31 AM",
  },
  {
    id: "44",
    text: "Going great! Working on an exciting project.",
    type: "sent",
    time: "10:31 AM",
  },
  {
    id: "51",
    text: "That's awesome! I'd love to hear more about it.",
    type: "received",
    time: "10:30 AM",
  },
  {
    id: "53",
    text: "That's awesome! I'd love to hear more about it.",
    type: "received",
    time: "10:30 AM",
  },
  {
    id: "52",
    text: "That's awesome! I'd love to hear more about it.",
    type: "received",
    time: "10:30 AM",
  },
];

// ---------------- MAIN SCREEN ----------------
export default function ChatScreen() {
  const chatId = useLocalSearchParams().uid as string;
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const user = useAppSelector((state) => state.auth.user);
  const [text, setText] = useState("");

  useEffect(() => {
    // Real time messages start
    // chatId available thay etle listen sharu
    const channel = createMessagesChannel(chatId);
    return () => {
      dispatch(clearChat());
    };
  }, [chatId]);

  const handleSend = () => {
    if (!text.trim()) return;
    dispatch(
      sendMessage({
        chatId,
        senderUid: user?.uid || "",
        text: text.trim(),
      }),
    );
    setText("");
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageContainer,
        item.type === "sent" ? styles.sent : styles.received,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* HEADER (FIXED) */}
        <ChatHeader />

        {/* MESSAGE LIST (SCROLLABLE) */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        />

        {/* INPUT (FIXED BOTTOM) */}
        <ChatInput />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#6C63FF",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },
  messageText: {
    color: "#000",
  },
  time: {
    fontSize: 10,
    marginTop: 5,
    color: "gray",
    alignSelf: "flex-end",
  },
});
