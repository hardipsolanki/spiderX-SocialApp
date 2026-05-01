import { TEXTS } from "@/constants/texts";
import { Tab } from "@/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

export default TabBar;

const styles = StyleSheet.create({
  // Tabs
  tabRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
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
});
