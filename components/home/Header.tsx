import { COLORS } from "@/constants/colors";
import { TEXTS } from "@/constants/texts";
import { useAppDispatch } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const Header = ({ onSearch }: { onSearch: (text: string) => void }) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.title}>{TEXTS.HOME.GREETING}</Text>
      <Text style={styles.subtitle}>{TEXTS.HOME.SUBTITLE}</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder={TEXTS.CHAT.SEARCH}
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },
  sectionHeader: {
    padding: 10,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 12,
  },
  searchBox: {
    backgroundColor: "#F1F1F1",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
  },

  input: {
    marginLeft: 8,
    flex: 1,
  },
});
