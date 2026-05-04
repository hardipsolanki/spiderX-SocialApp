// screens/UserProfileScreen.tsx
import {
  getConnectedUserThunk,
  getSingleUserThunk,
} from "@/features/auth/authSlice";
import { openOrCreateChat } from "@/features/chat/chatSlice";
import {
  acceptRequest,
  sendConnection,
} from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  name: string;
  title: string;
  tags: string[];
  location: string;
  email: string;
  phone: string;
  memberSince: string;
  about: string;
  avatar: string;
}

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.backBtn}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons name="chevron-back" size={22} color="#1A1A2E" />
  </TouchableOpacity>
);

const Avatar = ({ uri }: { uri: string }) => (
  <View style={styles.avatarWrapper}>
    <Image source={{ uri }} style={styles.avatar} />
  </View>
);

const TagPill = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const InfoRow = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <Text style={styles.infoText}>{value}</Text>
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function UserProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading: connectionLoading } = useAppSelector(
    (state) => state.connection,
  );
  const { uid } = useLocalSearchParams<{ uid: string }>();

  const { isLoading, singleUser, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSingleUserThunk(uid));
  }, []);

  if (isLoading === "pending") {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

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

  // Connected user ના profile પર "Message" button
  const handleOpenChat = () => {
    dispatch(
      openOrCreateChat({
        currentUid: user?.uid || "",
        otherUid: singleUser?.uid || "",
      }),
    );
  };

  // Chat open થાય ત્યારે navigate કરો
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    if (currentChatId) {
      router.push({
        pathname: "/(root)/chat/[uid]",
        params: { uid: singleUser?.uid },
      });
    }
  }, [currentChatId]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <BackButton onPress={() => router.back()} />

        {/* Avatar */}
        <View style={styles.headerSection}>
          <Avatar uri={singleUser?.avatar || ""} />

          {/* Name + Title */}
          <Text style={styles.name}>
            {singleUser?.first_name + " " + singleUser?.last_name}
          </Text>
          <Text style={styles.title}>{singleUser?.designation}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {singleUser?.interest?.map((t) => (
              <TagPill key={t} label={t} />
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Info Rows */}
        <View style={styles.infoSection}>
          <InfoRow
            icon={
              <Ionicons name="location-outline" size={18} color="#6C5CE7" />
            }
            value={singleUser?.location || ""}
          />
          <InfoRow
            icon={<Ionicons name="mail-outline" size={18} color="#6C5CE7" />}
            value={singleUser?.email || ""}
          />
          <InfoRow
            icon={<Ionicons name="call-outline" size={18} color="#6C5CE7" />}
            value={singleUser?.phone_number || ""}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* About */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeading}>About</Text>
          <Text style={styles.aboutBody}>{singleUser?.about || ""}</Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footer}>
        {singleUser?.connectionReqStatus === null ||
        singleUser?.connectionReqStatus === "rejected" ? (
          <TouchableOpacity
            disabled={connectionLoading === "pending"}
            style={styles.inviteBtn}
            activeOpacity={0.85}
            onPress={() => handleSendToConnection(singleUser?.uid || "")}
          >
            <Text style={styles.inviteBtnText}>Send Connection Request</Text>
          </TouchableOpacity>
        ) : singleUser?.connectionReqStatus === "requested" ? (
          <TouchableOpacity
            disabled={connectionLoading === "pending"}
            style={styles.inviteBtn}
            activeOpacity={0.85}
            onPress={handleAceptReq}
          >
            <Text style={styles.inviteBtnText}>Accept</Text>
          </TouchableOpacity>
        ) : (
          <>
            {singleUser?.connectionReqStatus === "pending" ? (
              <View style={styles.inviteBtn}>
                <Text style={styles.inviteBtnText}>Pending</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.inviteBtn}
                onPress={() =>
                  router.push({
                    pathname: "/(root)/chat/[uid]",
                    params: { uid: singleUser?.uid },
                  })
                }
              >
                <Text style={styles.inviteBtnText}>Message</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Back button
  backBtn: {
    marginTop: 8,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F4F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Header / avatar section
  headerSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#6C5CE7",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: "#888",
    fontWeight: "400",
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F0EEFF",
    borderWidth: 1,
    borderColor: "#D4CCFF",
  },
  tagText: {
    fontSize: 12,
    color: "#6C5CE7",
    fontWeight: "600",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#F0F0F5",
    marginHorizontal: 24,
  },

  // Info section
  infoSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F4F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
    flex: 1,
  },

  // About section
  aboutSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 8,
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  aboutBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },

  // Footer CTA
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
  },
  inviteBtn: {
    backgroundColor: "#6C5CE7",
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  inviteBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
