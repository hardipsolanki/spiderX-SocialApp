// ─── screens/InvitationsScreen.tsx ───────────────────────────────────────────
import InvitationCard from "@/components/InvitationCard";
import TabBar from "@/components/TabsBar";
import { TEXTS } from "@/constants/texts";
import {
  getReceivedRequests,
  getSentRequests,
} from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Tab } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const InvitationsScreen = () => {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const dispatch = useAppDispatch();
  const { receivedConnectionRequest, isLoading, sendConnectionRequest } =
    useAppSelector((state) => state.connection);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "received") {
      dispatch(getReceivedRequests(user.uid));
    } else {
      dispatch(getSentRequests(user.uid));
    }
  }, [dispatch, activeTab, user]);
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* List */}
      <FlatList
        data={
          activeTab === "received"
            ? receivedConnectionRequest
            : sendConnectionRequest
        }
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <InvitationCard item={item} isSend={activeTab === "sent"} />
        )}
        ListHeaderComponent={
          <>
            <TabBar active={activeTab} onChange={setActiveTab} />
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading === "pending" ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <Ionicons name="mail-open-outline" size={48} color="#C5C3DC" />
                <Text style={styles.emptyText}>{TEXTS.INVITATIONS.EMPTY}</Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default InvitationsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 0.2,
  },

  // List
  listContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },

  // Empty state
  emptyState: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#BBBBCC",
    fontWeight: "500",
  },
});
