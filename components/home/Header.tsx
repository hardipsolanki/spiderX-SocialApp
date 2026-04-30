import { COLORS } from "@/constants/colors";
import { TEXTS } from "@/constants/texts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.title}>{TEXTS.HOME.GREETING}</Text>
      <Text style={styles.subtitle}>{TEXTS.HOME.SUBTITLE}</Text>
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
});
