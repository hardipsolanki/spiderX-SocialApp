import { logoutThunk } from "@/features/auth/authSlice";
import { persistor } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewProfile() {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await persistor.purge();
    dispatch(logoutThunk());
    router.replace("/(auth)/phoneLogin");
  };

  const Row = ({ label, value }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color="#6C5CE7" />
            </View>
          )}

          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.designation}>{user?.designation}</Text>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.card}>
          <Row label="Phone" value={user?.phone_number} />
          <Row label="Email" value={user?.email} />
          <Row label="Location" value={user?.location} />
        </View>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.about}>{user?.about}</Text>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          disabled={isLoading === "pending"}
          style={[
            styles.logoutBtn,
            isLoading === "pending" && {
              opacity: 0.5,
            },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scroll: {
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  designation: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  row: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 14,
    color: "#111",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  about: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
