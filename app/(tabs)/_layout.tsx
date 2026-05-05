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
        tabBarStyle: {
          height: 100,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
          tabBarBadge: unreadChatsCount > 0 ? unreadChatsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "red",
            color: "white",
          },
        }}
      />
      <Tabs.Screen
        name="invitations"
        options={{
          title: "Invitations",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={22} color={color} />
          ),
          tabBarBadge:
            recievedInvatationsReq && recievedInvatationsReq?.length > 0
              ? recievedInvatationsReq?.length
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "red",
            color: "white",
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={22} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="chat"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={22} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
