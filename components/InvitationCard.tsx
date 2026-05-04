import { TEXTS } from "@/constants/texts";
import { getConnectedUserThunk } from "@/features/auth/authSlice";
import {
  acceptRequest,
  rejectAndRemoveRequest,
} from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const InvitationCard = ({
  item,
  isSend,
}: {
  item: User & { requestId: string };
  isSend: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.connection);
  const user = useAppSelector((state) => state.auth.user);
  const handleDeclineReq = () => {
    dispatch(
      rejectAndRemoveRequest({
        requestId: item.requestId,
        rejectedUserUid: item?.uid || "",
      }),
    );
    // Toast saga handle karche — InvitationCard ma koi .then() ni jarur nathi
  };

  const handleAceptReq = () => {
    dispatch(
      acceptRequest({
        senderUid: item.uid,
        receiverUid: user?.uid || "",
      }),
    );
    dispatch(getConnectedUserThunk(user?.uid || ""));
  };

  return (
    <View style={styles.card}>
      {/* Top row */}
      <Link href={`/userProfile/${item.uid}`} style={styles.cardLink}>
        <View style={styles.cardTop}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.first_name}</Text>
            <Text style={styles.cardRole}>{item.designation}</Text>
          </View>

          <View style={styles.cardMeta}>
            <Text style={styles.cardWants}>
              {TEXTS.INVITATIONS.WANTS_TO_CONNECT}
            </Text>
            <Text style={styles.cardTime}>
              {item.createdAt?.getTimezoneOffset()}
            </Text>
          </View>
        </View>
      </Link>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          disabled={isLoading === "pending"}
          style={styles.declineBtn}
          activeOpacity={0.75}
          onPress={handleDeclineReq}
        >
          <Text style={styles.declineText}>{TEXTS.INVITATIONS.DECLINE}</Text>
        </TouchableOpacity>

        {!isSend && (
          <TouchableOpacity
            disabled={isLoading === "pending"}
            style={styles.acceptBtn}
            activeOpacity={0.8}
            onPress={handleAceptReq}
          >
            <Text style={styles.acceptText}>{TEXTS.INVITATIONS.ACCEPT}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InvitationCard;

const styles = StyleSheet.create({
  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0EEF8",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardLink: {
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  cardRole: {
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  cardWants: {
    fontSize: 11,
    color: "#999",
    marginBottom: 3,
  },
  cardTime: {
    fontSize: 11,
    color: "#BBBBCC",
    fontWeight: "500",
  },

  // Card divider
  cardDivider: {
    height: 1,
    backgroundColor: "#F4F3FF",
    marginBottom: 12,
  },

  // Card actions
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  declineBtn: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#F4F3FF",
    borderWidth: 1,
    borderColor: "#E0DEFF",
  },
  declineText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  acceptBtn: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#6C5CE7",
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
