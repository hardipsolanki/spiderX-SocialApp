import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TEXTS } from "../constants/texts";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [mute, setMute] = useState(false);

  const { PROFILE } = TEXTS;
  const MenuItem = ({
    icon,
    title,
    right,
    danger,
    onPress,
  }: {
    icon: any;
    title: string;
    right?: React.ReactNode;
    danger?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={danger ? "#EF4444" : "#444"} />
        <Text style={[styles.itemText, danger && { color: "#EF4444" }]}>
          {title}
        </Text>
      </View>

      {right || <Ionicons name="chevron-forward" size={18} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://randomuser.me/api/portraits/women/44.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{PROFILE.NAME}</Text>
      </View>

      {/* MENU */}
      <View style={styles.card}>
        <MenuItem icon="person-outline" title={PROFILE.VIEW_PROFILE} />

        <MenuItem icon="search-outline" title={PROFILE.SEARCH} />

        <MenuItem
          icon="notifications-outline"
          title={PROFILE.NOTIFICATIONS}
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: "#6C5CE7" }}
            />
          }
        />

        <MenuItem icon="folder-outline" title={PROFILE.MEDIA} />

        <MenuItem
          icon="volume-mute-outline"
          title={PROFILE.MUTE}
          right={
            <Switch
              value={mute}
              onValueChange={setMute}
              trackColor={{ true: "#6C5CE7" }}
            />
          }
        />

        <MenuItem icon="trash-outline" title={PROFILE.CLEAR} />

        <MenuItem icon="close-circle-outline" title={PROFILE.BLOCK} danger />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },

  card: {
    flex: 1,
    // backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 10,
    // elevation: 3,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  itemText: {
    fontSize: 14,
    color: "#333",
  },
});
