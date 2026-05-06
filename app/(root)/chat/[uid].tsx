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
import React, { useCallback, useEffect, useState } from "react";
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

  const flatListRef = React.useRef<FlatList>(null);
  const [text, setText] = useState("");

  // get user from chats instead of connectedUsers
  const chat = chats.find((c) => c.otherUser.uid === uid);
  const otherUser = chat?.otherUser;

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
      // Optional: Clear current chat when leaving screen
      dispatch(clearChat());
    };
  }, [uid, user?.uid, dispatch]);

  // Auto scroll to bottom on initial load and new messages
  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, []);

  // Scroll to bottom when messages change (initial load or new messages)
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  // Mark chat as read when entering screen
  useEffect(() => {
    if (chatId && user?.uid) {
      dispatch(
        markChatAsRead({
          chatId: chatId,
          uid: user.uid,
        }),
      );
    }
  }, [chatId, user?.uid, dispatch]);

  // Mark unread messages as read when new message from other user arrives
  useEffect(() => {
    if (!chatId || !user?.uid || !messages.length) return;

    const lastMessage = messages[messages.length - 1];

    // only mark if message is from OTHER user and unread
    if (lastMessage.sentBy?.uid !== user.uid && !lastMessage.isRead) {
      dispatch(
        markChatAsRead({
          chatId,
          uid: user.uid,
        }),
      );
    }
  }, [messages, chatId, user?.uid, dispatch]);

  const handleSend = () => {
    if (!text.trim() || !chatId) return;

    dispatch(
      sendMessage({
        chatId,
        senderUid: user?.uid!,
        text: text.trim(),
      }),
    );

    setText("");
  };

  const onContentSizeChange = useCallback(() => {
    // Always scroll to end without animation for instant positioning
    flatListRef.current?.scrollToEnd({ animated: false });
  }, []);

  const renderItem = ({ item }: any) => {
    const isMe = item.sentBy?.uid === user?.uid;

    return (
      <View
        style={[styles.messageContainer, isMe ? styles.sent : styles.received]}
      >
        <Text style={[styles.messageText, isMe && { color: "#fff" }]}>
          {item.text}
        </Text>

        {item.createdAt && (
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ChatHeader
          chatId={chatId!}
          avatar={otherUser?.avatar || ""}
          number={otherUser?.phone_number || ""}
          fullname={
            otherUser
              ? otherUser.first_name + " " + otherUser.last_name
              : "Chat"
          }
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={onContentSizeChange}
          onLayout={onContentSizeChange}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />

        <ChatInput value={text} onChangeText={setText} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
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
