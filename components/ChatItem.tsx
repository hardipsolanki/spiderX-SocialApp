import { useDebounce } from "@/hooks/useNavigationGuard.ts";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  message?: string;
  time?: string;
  avatar: string;
  unread?: number;
  uid: string;
}

export default function ChatItem({
  name,
  message,
  time,
  avatar,
  unread,
  uid,
}: Props) {
  const router = useRouter();
  // Usage:
  const handleClick = useDebounce((routes) => {
    router.push({
      pathname: routes,
      params: { uid },
    });
  }, 500);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handleClick("/(root)/chat/[uid]");
        }}
        style={styles.link}
      >
        <Image source={{ uri: avatar }} style={styles.avatar} />

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{time || ""}</Text>
          </View>

          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.message}>
              {message || "Start conversation..."}
            </Text>

            {unread ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },

  link: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    // fontWeight: "600",
  },

  time: {
    fontSize: 11,
    color: "#999",
  },

  message: {
    fontSize: 13,
    // color: "#666",
    flex: 1,
    marginTop: 2,
    fontWeight: "bold",
  },

  badge: {
    backgroundColor: "#6C5CE7",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
