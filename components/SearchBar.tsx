import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#999" />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F1F1F5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
});
