import { COLORS } from "@/constants/colors";
import { TEXTS } from "@/constants/texts";
import React from "react";
import { StyleSheet, Text } from "react-native";
import SearchBar from "../SearchBar";

const Header = () => {
  return (
    <>
      <Text style={styles.title}>{TEXTS.HOME.GREETING}</Text>
      <Text style={styles.subtitle}>{TEXTS.HOME.SUBTITLE}</Text>

      {/* SEARCH */}
      <SearchBar placeholder={TEXTS.HOME.SEARCH} />
    </>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 12,
  },
});
