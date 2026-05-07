import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import {
  clearChat,
  markChatAsRead,
  openChat,
  sendMessage,
} from "@/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { uid } = useLocalSearchParams();

  const dispatch = useAppDispatch();

  const { messages, chats } = useAppSelector((state) => state.chat);

  const chatId = useAppSelector((state) => state.chat.currentChatId);

  const user = useAppSelector((state) => state.auth.user);

  const [text, setText] = useState("");

  // ✅ Get Current Chat User
  const chat = chats.find((c) => c.otherUser.uid === uid);

  const otherUser = chat?.otherUser;

  // ✅ Reverse Messages For Inverted FlatList
  const reversedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  // ✅ Open Chat
  useEffect(() => {
    if (uid && user?.uid) {
      dispatch(
        openChat({
          currentUid: user.uid,
          otherUid: uid as string,
        }),
      );
    }

    return () => {
      dispatch(clearChat());
    };
  }, [uid, user?.uid]);

  // ✅ Mark Chat Read
  useEffect(() => {
    if (chatId && user?.uid) {
      dispatch(
        markChatAsRead({
          chatId,
          uid: user.uid,
        }),
      );
    }
  }, [chatId, user?.uid]);

  // ✅ Mark New Incoming Messages As Read
  useEffect(() => {
    if (!chatId || !user?.uid || !messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.sentBy?.uid !== user.uid && !lastMessage.isRead) {
      dispatch(
        markChatAsRead({
          chatId,
          uid: user.uid,
        }),
      );
    }
  }, [messages]);

  // ✅ Send Message
  const handleSend = () => {
    if (!text.trim() || !chatId || !user?.uid) return;

    dispatch(
      sendMessage({
        chatId,
        senderUid: user.uid,
        text: text.trim(),
      }),
    );

    setText("");
  };

  // ✅ Message Bubble
  const renderItem = ({ item }: any) => {
    const isMe = item.sentBy?.uid === user?.uid;

    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? styles.sentWrapper : styles.receivedWrapper,
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            isMe ? styles.sent : styles.received,
          ]}
        >
          <Text style={[styles.messageText, isMe && styles.sentText]}>
            {item.text}
          </Text>

          {item.createdAt && (
            <Text style={[styles.time, isMe && styles.sentTime]}>
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* HEADER */}
        <ChatHeader
          chatId={chatId!}
          avatar={otherUser?.avatar || ""}
          number={otherUser?.phone_number || ""}
          fullname={
            otherUser
              ? `${otherUser.first_name} ${otherUser.last_name}`
              : "Chat"
          }
        />

        {/* CHAT LIST */}
        <FlatList
          data={reversedMessages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chatContent}
          removeClippedSubviews={false}
        />

        {/* INPUT */}
        <ChatInput value={text} onChangeText={setText} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  chatContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
  },

  // Wrapper
  messageWrapper: {
    marginVertical: 4,
    flexDirection: "row",
  },

  sentWrapper: {
    justifyContent: "flex-end",
  },

  receivedWrapper: {
    justifyContent: "flex-start",
  },

  // Bubble
  messageContainer: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  sent: {
    backgroundColor: "#6C5CE7",

    borderBottomRightRadius: 4,
  },

  received: {
    backgroundColor: "#FFFFFF",

    borderBottomLeftRadius: 4,

    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  // Text
  messageText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },

  sentText: {
    color: "#FFFFFF",
  },

  // Time
  time: {
    fontSize: 10,
    color: "#6B7280",
    alignSelf: "flex-end",
    marginTop: 6,
  },

  sentTime: {
    color: "rgba(255,255,255,0.7)",
  },
});
