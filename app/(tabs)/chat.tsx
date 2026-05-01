import ChatItem from "@/components/ChatItem";
import { TEXTS } from "@/constants/texts";
import { fetchConnections } from "@/features/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsScreen() {
  const dispatch = useAppDispatch();
  const { connections } = useAppSelector((state) => state.connection);
  const user = useAppSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchConnections(user.uid));
    }
  }, [user?.uid]);

  // 🔍 Search filter (optimized)
  const filteredConnections = useMemo(() => {
    return connections?.filter((item) =>
      `${item.first_name} ${item.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, connections]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>{TEXTS.CHAT.CHAT}</Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder={TEXTS.CHAT.SEARCH}
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredConnections || []}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <ChatItem
            name={`${item.first_name} ${item.last_name}`}
            avatar={item.avatar}
            message={"Hey! Let's chat"}
            time={""}
            unread={0}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{TEXTS.CHAT.EMPTY}</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },

  input: {
    marginLeft: 8,
    flex: 1,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
