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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
});
