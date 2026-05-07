// import SearchBar from "@/components/SearchBar";
// import UserCard from "@/components/UserCard";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import React, { useMemo, useRef, useState } from "react";
// import { FlatList, StyleSheet, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import UserProfileScreen from "../(root)/userProfile/[uid]";
// import {
//   getUsersWithInterestsThunk,
//   handleUserSearch,
// } from "../../features/auth/authSlice";

// export default function SearchScreen() {
//   const dispatch = useAppDispatch();
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["90%"], []);
//   const [selectedUserId, setSelectedUserId] = useState("");

//   const { searchResults, usersWithInterests, searchText } = useAppSelector(
//     (state) => state.auth,
//   );
//   const [refreshing, setRefreshing] = useState(false);

//   const onSearch = (text: string) => {
//     dispatch(handleUserSearch({ search: text }));
//   };

//   const handlePullToRefresh = async () => {
//     setRefreshing(true);
//     try {
//       dispatch(getUsersWithInterestsThunk()).unwrap();
//       dispatch(handleUserSearch({ search: "" }));
//     } catch (err) {
//       console.log("Refresh error:", err);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleOpenProfile = (uid: string) => {
//     setSelectedUserId(uid);

//     requestAnimationFrame(() => {
//       bottomSheetRef.current?.snapToIndex(0);
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* 🔍 Header */}
//       <SearchBar placeholder="Search users..." onSearch={onSearch} />

//       {/* 📋 Search Results */}
//       <FlatList
//         data={searchText ? searchResults : usersWithInterests} // Show all users if no search, else show results
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={<Text style={styles.header}>Search Results</Text>}
//         ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
//         renderItem={({ item }) => (
//           <UserCard
//             uid={item.user.uid}
//             name={item.user.first_name + " " + item.user.last_name} // {first_name} {last_name.}
//             image={item.user.avatar}
//             role={item.user.designation}
//             tags={item.interest.slice(0, 3).join(", ")} // interest removed because now it's User[]
//             connectionReqStatus={item.connectionReqStatus}
//             onPress={() => handleOpenProfile(item.user.uid)}
//           />
//         )}
//         refreshing={refreshing} // ✅ important
//         onRefresh={handlePullToRefresh} // ✅ important
//       />

//       <BottomSheet
//         ref={bottomSheetRef}
//         index={-1}
//         snapPoints={snapPoints}
//         enablePanDownToClose={true}
//       >
//         <BottomSheetScrollView>
//           <UserProfileScreen userUid={selectedUserId} />
//         </BottomSheetScrollView>
//       </BottomSheet>
//     </SafeAreaView>
//   );
// }

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },

//   // 📌 Initial placeholder (before search)
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },

//   placeholderText: {
//     fontSize: 16,
//     color: "#999",
//     textAlign: "center",
//   },

//   // 🔍 Header text above results
//   header: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginHorizontal: 12,
//     marginTop: 10,
//     marginBottom: 5,
//     color: "#333",
//   },

//   // ❌ Empty state
//   empty: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#999",
//     fontSize: 15,
//   },
// });

import UserProfileContent from "@/components/ButtomSheet/Profile";
import SearchBar from "@/components/SearchBar";
import UserCard from "@/components/UserCard";
import {
  getUsersWithInterestsThunk,
  handleUserSearch,
} from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const dispatch = useAppDispatch();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["75%"], []);

  const [selectedUserId, setSelectedUserId] = useState("");

  const { searchResults, usersWithInterests, searchText } = useAppSelector(
    (state) => state.auth,
  );

  const [refreshing, setRefreshing] = useState(false);

  const onSearch = (text: string) => {
    dispatch(handleUserSearch({ search: text }));
  };

  const handlePullToRefresh = async () => {
    setRefreshing(true);

    try {
      await dispatch(getUsersWithInterestsThunk()).unwrap();

      dispatch(handleUserSearch({ search: "" }));
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  const handleOpenProfile = (uid: string) => {
    setSelectedUserId(uid);

    requestAnimationFrame(() => {
      bottomSheetRef.current?.present();
    });
  };
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar placeholder="Search users..." onSearch={onSearch} />

      <FlatList
        data={searchText ? searchResults : usersWithInterests}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Search Results</Text>}
        ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
        renderItem={({ item }) => (
          <UserCard
            uid={item.user.uid}
            name={item.user.first_name + " " + item.user.last_name}
            image={item.user.avatar}
            role={item.user.designation}
            tags={item.interest.slice(0, 3).join(", ")}
            connectionReqStatus={item.connectionReqStatus}
            onPress={() => handleOpenProfile(item.user.uid)}
          />
        )}
        refreshing={refreshing}
        onRefresh={handlePullToRefresh}
        showsVerticalScrollIndicator={false}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        {selectedUserId ? (
          <UserProfileContent
            userUid={selectedUserId}
            onClose={() => bottomSheetRef.current?.dismiss()}
          />
        ) : null}
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  header: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 15,
  },

  bottomSheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  handleIndicator: {
    backgroundColor: "#D1D5DB",
    width: 60,
    height: 5,
  },
});
