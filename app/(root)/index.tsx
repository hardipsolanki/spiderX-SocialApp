import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {/* ICON */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#6C5CE7", "#5A4AE3"]}
            style={styles.iconGradient}
          >
            <Ionicons name="people" size={32} color="#fff" />
          </LinearGradient>
        </View>

        {/* TEXT CONTENT */}
        <Text style={styles.title}>Connect. Chat. Grow.</Text>

        <Text style={styles.subtitle}>
          Find people with similar interests and start meaningful conversations.
        </Text>

        {/* buttums */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/phoneLogin")}
          >
            <LinearGradient
              colors={["#6C5CE7", "#4B3DF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* LOGIN */}
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/phoneLogin")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconContainer: {
    marginBottom: 30,
  },

  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },

  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  loginText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },

  loginLink: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
  },
});
