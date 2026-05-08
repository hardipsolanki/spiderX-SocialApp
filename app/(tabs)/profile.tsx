// import { logoutThunk } from "@/features/auth/authSlice";
// import { persistor } from "@/store";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React from "react";
// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function ViewProfile() {
//   const { user, isLoading } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const handleLogout = async () => {
//     await persistor.purge();
//     dispatch(logoutThunk());
//     router.dismissAll();
//     router.replace("/(auth)/phoneLogin");
//   };

//   const Row = ({ label, value }: any) => (
//     <View style={styles.row}>
//       <Text style={styles.label}>{label}</Text>
//       <Text style={styles.value}>{value || "-"}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* HEADER */}
//         <View style={styles.header}>
//           {user?.avatar ? (
//             <Image source={{ uri: user.avatar }} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Ionicons name="person" size={32} color="#6C5CE7" />
//             </View>
//           )}

//           <Text style={styles.name}>
//             {user?.first_name} {user?.last_name}
//           </Text>
//           <Text style={styles.designation}>{user?.designation}</Text>
//         </View>

//         {/* DETAILS CARD */}
//         <View style={styles.card}>
//           <Row label="Phone" value={user?.phone_number} />
//           <Row label="Email" value={user?.email} />
//           <Row label="Location" value={user?.location} />
//         </View>

//         {/* ABOUT */}
//         <View style={styles.card}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.about}>{user?.about}</Text>
//         </View>
//         <View style={styles.card}>
//           {/* Header Row */}
//           <View style={styles.cardHeader}>
//             <Text style={styles.sectionTitle}>Interests</Text>

//             <TouchableOpacity
//               style={styles.editBtn}
//               onPress={() =>
//                 router.push({
//                   pathname: "/interests",
//                   params: { uid: user?.uid },
//                 })
//               }
//             >
//               <Ionicons name="pencil" size={18} color="#6C5CE7" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.interestsContainer}>
//             <FlatList
//               data={user?.interest}
//               renderItem={({ item }) => (
//                 <View style={styles.tag}>
//                   <Text style={styles.tagText}>{item}</Text>
//                 </View>
//               )}
//               keyExtractor={(item, index) => index.toString()}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               ListEmptyComponent={() => (
//                 <Text style={styles.emptyText}>No interests added</Text>
//               )}
//               contentContainerStyle={styles.interestsList}
//             />
//           </View>
//         </View>
//         {/* LOGOUT */}
//         <TouchableOpacity
//           disabled={isLoading === "pending"}
//           style={[
//             styles.logoutBtn,
//             isLoading === "pending" && {
//               opacity: 0.5,
//             },
//           ]}
//           onPress={handleLogout}
//         >
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },

//   scroll: {
//     padding: 20,
//   },

//   header: {
//     alignItems: "center",
//     marginBottom: 20,
//   },

//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     marginBottom: 10,
//   },

//   avatarPlaceholder: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: "#EEE9FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },

//   name: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111",
//   },

//   designation: {
//     fontSize: 13,
//     color: "#666",
//     marginTop: 4,
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//   },

//   row: {
//     marginBottom: 12,
//   },

//   label: {
//     fontSize: 12,
//     color: "#888",
//   },

//   value: {
//     fontSize: 14,
//     color: "#111",
//     marginTop: 2,
//   },

//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 8,
//   },

//   about: {
//     fontSize: 13,
//     color: "#444",
//     lineHeight: 18,
//   },

//   logoutBtn: {
//     marginTop: 10,
//     backgroundColor: "#EF4444",
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   logoutText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   interestsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   tag: {
//     backgroundColor: "#6C5CE7",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//   },
//   tagText: {
//     color: "#FFF",
//     fontSize: 12,
//   },
//   emptyText: {
//     color: "#999",
//     fontSize: 13,
//   },
//   interestsList: {
//     paddingVertical: 8,
//     gap: 8,
//   },
//   updateBtn: {
//     marginTop: 12,
//     backgroundColor: "#6C5CE7",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },

//   updateBtnText: {
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 14,
//   },

//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   editBtn: {
//     padding: 6,
//     borderRadius: 20,
//     backgroundColor: "#F1F0FF",
//   },
// });

import EditInterestSheet from "@/components/ButtomSheet/Interests";
import { logoutThunk } from "@/features/auth/authSlice";
import { persistor } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewProfile() {
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // ✅ Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // ✅ Height
  const snapPoints = useMemo(() => ["75%"], []);

  const handleOpenSheet = () => {
    bottomSheetRef.current?.present();
  };

  const handleLogout = async () => {
    await persistor.purge();

    dispatch(logoutThunk());

    router.dismissAll();

    router.replace("/(auth)/phoneLogin");
  };

  const Row = ({ label, value }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color="#6C5CE7" />
            </View>
          )}

          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>

          <Text style={styles.designation}>{user?.designation}</Text>
        </View>

        {/* DETAILS */}
        <View style={styles.card}>
          <Row label="Phone" value={user?.phone_number} />

          <Row label="Email" value={user?.email} />

          <Row label="Location" value={user?.location} />
        </View>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>

          <Text style={styles.about}>{user?.about}</Text>
        </View>

        {/* INTERESTS */}
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Interests</Text>

            {/* 🔥 NEW BETTER BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.editBtn}
              onPress={handleOpenSheet}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Interests */}
          <View style={styles.interestsContainer}>
            <FlatList
              data={user?.interest}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              )}
            />
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          disabled={isLoading === "pending"}
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔥 BOTTOM SHEET */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        backgroundStyle={{
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: "#fff",
        }}
        handleIndicatorStyle={{
          backgroundColor: "#D1D5DB",
          width: 50,
        }}
      >
        <EditInterestSheet
          uid={user?.uid || ""}
          onClose={() => bottomSheetRef.current?.dismiss()}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scroll: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  designation: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  row: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 14,
    color: "#111",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  about: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  interestsContainer: {
    marginTop: 10,
  },

  tag: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginRight: 10,
  },

  tagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // 🔥 Better Button
  editBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 6,
  },
});
