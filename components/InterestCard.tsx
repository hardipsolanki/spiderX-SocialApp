import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface InterestCardProps {
  id: string;
  name: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}

export default function InterestCard({
  name,
  icon,
  selected,
  onPress,
}: InterestCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, selected && styles.iconContainerSelected]}
      >
        <Ionicons
          name={icon as any}
          size={28}
          color={selected ? COLORS.white : COLORS.primary}
        />
        {/* <Text style={styles.icon}>{icon || "📌"}</Text> */}
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
      {selected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    marginBottom: 12,
    position: "relative",
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainerSelected: {
    backgroundColor: COLORS.primary,
  },
  icon: {
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray700,
    flex: 1,
  },
  nameSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
