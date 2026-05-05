import ChatItem from "@/components/ChatItem";
import Header from "@/components/home/Header";
import { COLORS } from "@/constants/colors";
import { getUsersWithInterestsThunk } from "@/features/auth/authSlice";
import { fetchChats, handleChatUserSearch } from "@/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const dispatch = useAppDispatch();

  const { chats, chatLoading, searchResults } = useAppSelector(
    (state) => state.chat,
  );
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.uid) return;

    dispatch(fetchChats(user.uid));
    dispatch(getUsersWithInterestsThunk());
  }, [user?.uid]);

  if (chatLoading && !chats.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const onSearch = (text: string) => {
    dispatch(handleChatUserSearch({ search: text }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={searchResults.length > 0 ? searchResults : chats}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (
          <ChatItem
            avatar={item.otherUser?.avatar}
            name={
              item.otherUser
                ? item.otherUser.first_name + " " + item.otherUser.last_name
                : "User"
            }
            message={item.lastMessage || "Start conversation..."}
            time={
              item.lastMessageTime
                ? new Date(item.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            unread={item.unreadCount} // 🔥 IMPORTANT FIX
            uid={item.otherUser?.uid}
          />
        )}
        ListHeaderComponent={<Header onSearch={onSearch} />}
        contentContainerStyle={{ gap: 15 }}
        ListEmptyComponent={<Text style={styles.empty}>No chats found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
});
