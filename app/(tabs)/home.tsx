import Header from "@/components/home/Header";
import UserCard from "@/components/UserCard";
import { COLORS } from "@/constants/colors";
import { getUsersWithInterestsThunk } from "@/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const USERS = [
  {
    name: "Emma Wilson",
    role: "UI/UX Designer",
    tags: "Technology, Design",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Liam Smith",
    role: "Full Stack Developer",
    tags: "Technology, Sports",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Olivia Brown",
    role: "Product Manager",
    tags: "Business, Design",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Sophia Miller",
    role: "Marketing Specialist",
    tags: "Marketing, Travel",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUsersWithInterestsThunk());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={USERS}
        renderItem={({ item }) => <UserCard {...item} />}
        keyExtractor={(item) => item.name}
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
    padding: 20,
  },
});
