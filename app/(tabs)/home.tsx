import ChatItem from "@/components/ChatItem";
import Header from "@/components/home/Header";
import { COLORS } from "@/constants/colors";
import {
  getConnectedUserThunk,
  getUsersWithInterestsThunk,
} from "@/features/auth/authSlice";
import { getReceivedRequests } from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const dispatch = useAppDispatch();
  const { connectedUsers, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );
  useEffect(() => {
    dispatch(getConnectedUserThunk(user?.uid || ""));
    dispatch(getUsersWithInterestsThunk());
    dispatch(getReceivedRequests(user?.uid || ""));
  }, [dispatch]);

  if (isLoading === "pending" && !connectedUsers?.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={connectedUsers}
        renderItem={({ item }) => (
          <ChatItem
            avatar={item.avatar}
            name={item.first_name + " " + item.last_name}
            message={"Hey there! I am using SpiderX."}
            time={item.createdAt?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            unread={1}
          />
        )}
        keyExtractor={(item) => item.uid}
        ListHeaderComponent={<Header />}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No connected users found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },
});
