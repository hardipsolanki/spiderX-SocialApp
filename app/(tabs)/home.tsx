import Header from "@/components/home/Header";
import UserCard from "@/components/UserCard";
import { COLORS } from "@/constants/colors";
import { getUsersWithInterestsThunk } from "@/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const dispatch = useAppDispatch();
  const { usersWithInterests } = useAppSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getUsersWithInterestsThunk());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={usersWithInterests}
        renderItem={({ item }) => (
          <UserCard
            uid={item.user.uid}
            name={item.user.first_name + " " + item.user.last_name}
            image={item.user.avatar}
            role={item.user.designation}
            tags={item.interest.join(", ")}
            connectionReq={item.connectionReq}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Header />}
        ListHeaderComponentStyle={{ marginBottom: 20 }}
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
});
