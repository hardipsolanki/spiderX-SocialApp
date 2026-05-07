import ProfileSkeleton from "@/components/skeleton/userProfile";
import { COLORS } from "@/constants/colors";
import {
    getConnectedUserThunk,
    getSingleUserThunk,
} from "@/features/auth/authSlice";
import {
    acceptRequest,
    sendConnection,
} from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserProfileContent({
  userUid,
  onClose,
}: {
  userUid: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const { isLoading, singleUser, user } = useAppSelector((state) => state.auth);

  const { isLoading: connectionLoading } = useAppSelector(
    (state) => state.connection,
  );

  useEffect(() => {
    if (!userUid) return;

    dispatch(getSingleUserThunk(userUid));
  }, [userUid]);

  const handleSendToConnection = (sendConnectionuid: string) => {
    dispatch(
      sendConnection({
        sendUserUid: user?.uid || "",
        receiverUid: sendConnectionuid,
      }),
    );
  };

  const handleAceptReq = () => {
    dispatch(
      acceptRequest({
        senderUid: singleUser?.uid || "",
        receiverUid: user?.uid || "",
      }),
    );

    dispatch(getConnectedUserThunk(user?.uid || ""));
  };

  if (isLoading === "pending") {
    return <ProfileSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* CLOSE BUTTON */}

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={22} color="#111" />
      </TouchableOpacity>

      {/* SCROLLABLE CONTENT */}

      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE */}

        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: singleUser?.avatar,
              }}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>
            {singleUser?.first_name} {singleUser?.last_name}
          </Text>

          <Text style={styles.title}>{singleUser?.designation}</Text>

          <FlatList
            horizontal
            data={singleUser?.interest}
            renderItem={({ item }) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => item + index}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tags}
          />
        </View>

        <View style={styles.divider} />

        {/* INFO */}

        <View style={styles.infoSection}>
          <InfoRow icon="location-outline" value={singleUser?.location || ""} />

          <InfoRow icon="mail-outline" value={singleUser?.email || ""} />

          <InfoRow icon="call-outline" value={singleUser?.phone_number || ""} />
        </View>

        <View style={styles.divider} />

        {/* ABOUT */}

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeading}>About</Text>

          <Text style={styles.aboutBody}>{singleUser?.about || ""}</Text>
        </View>

        {/* <View style={{ height: 50 }} /> */}
      </BottomSheetScrollView>

      {/* STICKY FOOTER BUTTON */}

      <View style={styles.footer}>
        {singleUser?.connectionReqStatus === null ||
        singleUser?.connectionReqStatus === "rejected" ? (
          <TouchableOpacity
            disabled={connectionLoading === "pending"}
            style={styles.inviteBtn}
            onPress={() => handleSendToConnection(singleUser?.uid || "")}
          >
            <Text style={styles.inviteBtnText}>Send Connection Request</Text>
          </TouchableOpacity>
        ) : singleUser?.connectionReqStatus === "requested" ? (
          <TouchableOpacity style={styles.inviteBtn} onPress={handleAceptReq}>
            <Text style={styles.inviteBtnText}>Accept</Text>
          </TouchableOpacity>
        ) : singleUser?.connectionReqStatus === "pending" ? (
          <View style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Pending</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, value }: { icon: any; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={18} color={COLORS.primaryDark} />
    </View>

    <Text style={styles.infoText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 999,
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  headerSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },

  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    marginBottom: 16,
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  title: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  tags: {
    gap: 8,
    marginTop: 14,
    marginBottom: 20,
  },

  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
  },

  tagText: {
    color: "#4F46E5",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 24,
  },

  infoSection: {
    padding: 24,
    gap: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    flex: 1,
    color: "#374151",
    fontSize: 14,
  },

  aboutSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  aboutHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },

  aboutBody: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 24,
  },

  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  inviteBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
  },

  inviteBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
