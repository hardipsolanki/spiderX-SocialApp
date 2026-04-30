import SearchBar from "@/components/SearchBar";
import UserCard from "@/components/UserCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleUserSearch } from "../../features/authSlice";

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.auth.serachableUser);

  const [isSearching, setIsSearching] = useState(false);

  const onSearch = (text: string) => {
    if (text.trim().length > 0) {
      setIsSearching(true);
      dispatch(handleUserSearch({ search: text }));
    } else {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Header */}
      <SearchBar placeholder="Search users..." onSearch={onSearch} />

      {/* 📌 Initial Content */}
      {!isSearching && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            🔍 Search for users by name
          </Text>
        </View>
      )}

      {/* 📋 Search Results */}
      {isSearching && (
        <FlatList
          data={users || []}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Text style={styles.header}>Search Results</Text>
          }
          ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
          renderItem={({ item }) => (
            <UserCard
              uid={item.user.uid}
              name={item.user.first_name + " " + item.user.last_name} // {first_name} {last_name.}
              image={item.user.avatar}
              role={item.user.designation}
              tags={item.interest.slice(0, 3).join(", ")} // interest removed because now it's User[]
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  // 📌 Initial placeholder (before search)
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  placeholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },

  // 🔍 Header text above results
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },

  // ❌ Empty state
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
});
