import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({
  placeholder,
  onSearch,
}: {
  placeholder: string;
  onSearch: (text: string) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#999" />
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#999"
        autoFocus
        autoCorrect
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1F1F1",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    margin: 10,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
});
