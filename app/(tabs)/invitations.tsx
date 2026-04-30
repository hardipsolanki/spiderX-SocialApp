// ─── screens/InvitationsScreen.tsx ───────────────────────────────────────────
import { TEXTS } from "@/constants/texts";
import { connectionService } from "@/firebase/connection";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────
interface Invitation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  timeAgo: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const RECEIVED: Invitation[] = [
  {
    id: "1",
    name: "Noah Davis",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    timeAgo: "2h ago",
  },
  {
    id: "2",
    name: "Ava Martinez",
    role: "Marketing Specialist",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    timeAgo: "1d ago",
  },
];

const SENT: Invitation[] = [
  {
    id: "3",
    name: "Liam Johnson",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    timeAgo: "3h ago",
  },
];

// ─── Tab bar ──────────────────────────────────────────────────────────────────
type Tab = "received" | "sent";

const TabBar = ({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) => (
  <View style={styles.tabRow}>
    {(["received", "sent"] as Tab[]).map((t) => (
      <TouchableOpacity
        key={t}
        style={styles.tabItem}
        onPress={() => onChange(t)}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabLabel, active === t && styles.tabLabelActive]}>
          {t === "received"
            ? TEXTS.INVITATIONS.TAB_RECEIVED
            : TEXTS.INVITATIONS.TAB_SENT}
        </Text>
        {active === t && <View style={styles.tabUnderline} />}
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Invitation Card ─────────────────────────────────────────────────────────
const InvitationCard = ({
  item,
  onDecline,
  onAccept,
}: {
  item: Invitation;
  onDecline: (id: string) => void;
  onAccept: (id: string) => void;
}) => (
  <View style={styles.card}>
    {/* Top row */}
    <View style={styles.cardTop}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardRole}>{item.role}</Text>
      </View>

      <View style={styles.cardMeta}>
        <Text style={styles.cardWants}>
          {TEXTS.INVITATIONS.WANTS_TO_CONNECT}
        </Text>
        <Text style={styles.cardTime}>{item.timeAgo}</Text>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.cardDivider} />

    {/* Actions */}
    <View style={styles.cardActions}>
      <TouchableOpacity
        style={styles.declineBtn}
        activeOpacity={0.75}
        onPress={() => onDecline(item.id)}
      >
        <Text style={styles.declineText}>{TEXTS.INVITATIONS.DECLINE}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.acceptBtn}
        activeOpacity={0.8}
        onPress={() => onAccept(item.id)}
      >
        <Text style={styles.acceptText}>{TEXTS.INVITATIONS.ACCEPT}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
const NAV_ITEMS: { key: string; label: string; icon: any; activeIcon: any }[] =
  [
    {
      key: "home",
      label: TEXTS.NAV.HOME,
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      key: "search",
      label: TEXTS.NAV.SEARCH,
      icon: "search-outline",
      activeIcon: "search",
    },
    {
      key: "chats",
      label: TEXTS.NAV.CHATS,
      icon: "chatbubble-outline",
      activeIcon: "chatbubble",
    },
    {
      key: "profile",
      label: TEXTS.NAV.PROFILE,
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

const BottomNav = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) => (
  <View style={styles.navBar}>
    {NAV_ITEMS.map((item) => {
      const isActive = active === item.key;
      return (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => onChange(item.key)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isActive ? item.activeIcon : item.icon}
            size={22}
            color={isActive ? "#6C5CE7" : "#BBBBCC"}
          />
          <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function InvitationsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const [activeNav, setActiveNav] = useState("chats");
  const [received, setReceived] = useState<Invitation[]>(RECEIVED);
  const [sent, setSent] = useState<Invitation[]>(SENT);

  const data = activeTab === "received" ? received : sent;
  const setData = activeTab === "received" ? setReceived : setSent;

  const handleDecline = (id: string) =>
    setData((prev) => prev.filter((i) => i.id !== id));

  const handleAccept = (id: string) =>
    setData((prev) => prev.filter((i) => i.id !== id));

  useEffect(() => {
    const get = async () => {
      console.log("first");
      await connectionService.getConnectionRequests(
        "jhjb90lEtnMH2O5tEHfTOFWP6HY2",
      );
    };
    get();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{TEXTS.INVITATIONS.TITLE}</Text>
      </View>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InvitationCard
            item={item}
            onDecline={handleDecline}
            onAccept={handleAccept}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="mail-open-outline" size={48} color="#C5C3DC" />
            <Text style={styles.emptyText}>{TEXTS.INVITATIONS.EMPTY}</Text>
          </View>
        }
      />

      {/* Bottom nav */}
      <BottomNav active={activeNav} onChange={setActiveNav} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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

  // Tabs
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F5",
    marginTop: 6,
  },
  tabItem: {
    marginRight: 28,
    paddingBottom: 10,
    paddingTop: 4,
    position: "relative",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#BBBBCC",
  },
  tabLabelActive: {
    color: "#6C5CE7",
    fontWeight: "700",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#6C5CE7",
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },

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

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#BBBBCC",
    fontWeight: "500",
  },

  // Bottom nav
  navBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    color: "#BBBBCC",
    fontWeight: "400",
  },
  navLabelActive: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
});
