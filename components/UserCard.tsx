import { COLORS } from "@/constants/colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  role: string;
  tags: string;
  image: string;
}

export default function UserCard({ name, role, tags, image }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.tags}>{tags}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 12,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
  },
  role: {
    fontSize: 12,
    color: "#666",
  },
  tags: {
    fontSize: 12,
    color: "#999",
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
});
