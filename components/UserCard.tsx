import { COLORS } from "@/constants/colors";
import {
  checkIsConnectionReqSended,
  getSentConnectionRequests,
  sendConnectionRequest,
} from "@/features/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  name: string;
  role: string;
  tags: string;
  image: string;
  uid: string;
}

export default function UserCard({ name, role, tags, image, uid }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading: connectionLoading, isConnectionReqSended } =
    useAppSelector((state) => state.connection);
  const user = useAppSelector((state) => state.auth.user);

  const handleSendToConnection = () => {
    dispatch(
      sendConnectionRequest({
        sendUserUid: user?.uid || "",
        receiverUid: uid,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getSentConnectionRequests(user?.uid || ""));
        dispatch(
          checkIsConnectionReqSended({
            sendUserUid: user?.uid || "",
            receiverUid: uid,
          }),
        );
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Connection request sent successfully",
        });
      });
  };

  useEffect(() => {
    dispatch(
      checkIsConnectionReqSended({
        sendUserUid: user?.uid || "",
        receiverUid: uid,
      }),
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* LEFT SIDE (Clickable area) */}
      <Link
        href={{
          pathname: "/(root)/userProfile/[uid]",
          params: { uid },
        }}
        asChild
      >
        <TouchableOpacity style={styles.left}>
          <Image source={{ uri: image }} style={styles.avatar} />

          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{role}</Text>
            <Text style={styles.tags}>{tags}</Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* RIGHT SIDE BUTTON */}
      {!isConnectionReqSended && (
        <TouchableOpacity
          disabled={connectionLoading === "pending"}
          onPress={handleSendToConnection}
          style={styles.button}
        >
          <Ionicons
            name="person-add-outline"
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ✅ important
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // ✅ take remaining space
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 12,
  },

  info: {
    flex: 1,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
});
