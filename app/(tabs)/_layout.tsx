import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const recievedInvatationsReq = useAppSelector(
    ({ connection }) => connection.receivedConnectionRequest,
  );

  const chat = useAppSelector((state) => state.chat.chats);
  const unreadChatsCount = chat.reduce((count, c) => count + c.unreadCount, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
          tabBarBadge: unreadChatsCount > 0 ? unreadChatsCount : undefined,
        }}
      />
      <Tabs.Screen
        name="invitations"
        options={{
          tabBarLabel: () => null,
          title: "Invitations",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={22} color={color} />
          ),
          tabBarBadge:
            recievedInvatationsReq && recievedInvatationsReq?.length > 0
              ? recievedInvatationsReq?.length
              : undefined,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: () => null,
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
