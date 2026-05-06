// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from "react-native-toast-message";

// import CustomButton from "@/components/CustomButton";
// import InterestCard from "@/components/InterestCard";
// import { COLORS } from "@/constants/colors";

// import { getInterestWithIcon } from "@/constants/interests";
// import { TEXTS } from "@/constants/texts";
// import { getCurrentUserThunk } from "@/features/auth/authSlice";
// import {
//   addUserInterest,
//   getInterests,
//   getUserInterests,
//   updateUserIntrestAction,
// } from "@/features/interest/interestSlice";
// import { authServices } from "@/firebase/auth";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

// export default function InterestsScreen() {
//   const router = useRouter();
//   const { uid } = useLocalSearchParams<{ uid: string }>();
//   const dispatch = useAppDispatch();
//   const { interests, isLoading, userInterests } = useAppSelector(
//     (state) => state.interest,
//   );
//   const user = useAppSelector((state) => state.auth.user);
//   const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

//   console.log("all interests: ", interests);
//   console.log("user inresets: ", userInterests.name);
//   console.log("selected intersets: ", selectedInterests);

//   // Check if user already has interests
//   useEffect(() => {
//     dispatch(getInterests());
//     if (uid) {
//       dispatch(getUserInterests({ uid }))
//         .unwrap()
//         .then((data) => {
//           setSelectedInterests(data.name);
//         });
//     }
//   }, [dispatch]);

//   const toggleInterest = (interestId: string) => {
//     setSelectedInterests((prev) => {
//       if (prev.includes(interestId)) {
//         // Remove interest
//         return prev.filter((id) => id !== interestId);
//       } else {
//         return [...prev, interestId];
//       }
//     });
//   };

//   const handleContinue = async () => {
//     if (selectedInterests.length < 1) {
//       Toast.show({
//         type: "error",
//         text1: "Selection Required",
//         text2: `Please select at least ${1} interests`,
//         position: "bottom",
//       });
//       return;
//     }
//     try {
//       if (uid) {
//         dispatch({
//           type: updateUserIntrestAction.toString(),
//           payload: { uid, interest: selectedInterests },
//         });
//         isLoading === "succeeded" && router.push("/profile");
//       } else {
//         const userRef = await authServices.getUserRef(user?.uid as string);
//         if (userRef) {
//           dispatch(addUserInterest({ userRef, interest: selectedInterests }))
//             .unwrap()
//             .then(() => {
//               dispatch(getCurrentUserThunk());
//               router.replace("/allCompleted");
//             });
//         }
//       }
//     } catch (error) {
//       console.log("error while add & update interests: ", error);
//     }
//   };

//   // Render each interest item
//   const renderInterestItem = (item: {
//     id: string;
//     name: string;
//     iconName: string;
//   }) => (
//     <View style={styles.itemWrapper}>
//       <InterestCard
//         id={item.id}
//         name={item.name}
//         icon={item.iconName}
//         selected={selectedInterests.includes(item.id)}
//         onPress={() => toggleInterest(item.id)}
//       />
//     </View>
//   );

//   if (!uid && (isLoading === "pending" || !interests.name?.length)) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>{TEXTS.INTERESTS.TITLE}</Text>
//           <Text style={styles.subtitle}>{TEXTS.INTERESTS.SUBTITLE}</Text>
//         </View>

//         {/* Interests Grid - FlatList with 2 columns */}
//         <FlatList
//           data={interests.name}
//           renderItem={({ item }) =>
//             renderInterestItem(getInterestWithIcon(item))
//           }
//           keyExtractor={(item) => item.toLocaleLowerCase()}
//           numColumns={2}
//           scrollEnabled={false} // Disable scrolling since it's inside ScrollView
//           contentContainerStyle={styles.flatListContent}
//           columnWrapperStyle={styles.columnWrapper}
//         />

//         {/* Continue Button */}
//         <View style={styles.buttonContainer}>
//           <CustomButton
//             loading={isLoading === "pending"}
//             title={uid ? TEXTS.INTERESTS.UPDATE : TEXTS.INTERESTS.BUTTON}
//             onPress={handleContinue}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     padding: 24,
//   },
//   header: {
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: COLORS.black,
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: COLORS.gray600,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 24,
//   },
//   counterContainer: {
//     marginTop: 8,
//   },
//   counterText: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: COLORS.gray600,
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   progressBarContainer: {
//     height: 4,
//     backgroundColor: COLORS.gray200,
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressBar: {
//     height: "100%",
//     backgroundColor: COLORS.primary,
//     borderRadius: 2,
//   },
//   flatListContent: {
//     paddingBottom: 8,
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   itemWrapper: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   validationContainer: {
//     backgroundColor: COLORS.warning + "20",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 24,
//     marginTop: 8,
//     alignItems: "center",
//   },
//   validationText: {
//     color: COLORS.warning,
//     fontSize: 13,
//     fontWeight: "500",
//   },
//   buttonContainer: {
//     marginBottom: 16,
//   },
//   skipButton: {
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   skipText: {
//     fontSize: 14,
//     color: COLORS.gray500,
//     textDecorationLine: "underline",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import CustomButton from "@/components/CustomButton";
import InterestCard from "@/components/InterestCard";
import { COLORS } from "@/constants/colors";

import { getInterestWithIcon } from "@/constants/interests";
import { TEXTS } from "@/constants/texts";
import { getCurrentUserThunk } from "@/features/auth/authSlice";
import {
  addUserInterest,
  getInterests,
  getUserInterests,
  updateUserIntrestAction,
} from "@/features/interest/interestSlice";
import { authServices } from "@/firebase/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function InterestsScreen() {
  const router = useRouter();
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const dispatch = useAppDispatch();

  const { interests, isLoading } = useAppSelector((state) => state.interest);
  const user = useAppSelector((state) => state.auth.user);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getInterests());

    if (uid) {
      dispatch(getUserInterests({ uid }))
        .unwrap()
        .then((data) => {
          setSelectedInterests(data.name);
        });
    }
  }, []);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId],
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 1) {
      Toast.show({
        type: "error",
        text1: "Selection Required",
        text2: `Please select at least 1 interests`,
        position: "bottom",
      });
      return;
    }

    try {
      if (uid) {
        dispatch({
          type: updateUserIntrestAction.toString(),
          payload: { uid, interest: selectedInterests },
        });

        if (isLoading === "succeeded") {
          router.replace("/profile"); // UI safe change
        }
      } else {
        const userRef = await authServices.getUserRef(user?.uid as string);

        if (userRef) {
          dispatch(addUserInterest({ userRef, interest: selectedInterests }))
            .unwrap()
            .then(() => {
              dispatch(getCurrentUserThunk());
              router.replace("/allCompleted");
            });
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const renderInterestItem = (item: {
    id: string;
    name: string;
    iconName: string;
  }) => (
    <View style={styles.itemWrapper}>
      <InterestCard
        id={item.id}
        name={item.name}
        icon={item.iconName}
        selected={selectedInterests.includes(item.id)}
        onPress={() => toggleInterest(item.id)}
      />
    </View>
  );

  if (!uid && (isLoading === "pending" || !interests.name?.length)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 BACK BUTTON (only if uid exists OR user came manually) */}
      {uid && (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{TEXTS.INTERESTS.TITLE}</Text>
        <Text style={styles.subtitle}>{TEXTS.INTERESTS.SUBTITLE}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={interests.name}
        renderItem={({ item }) => renderInterestItem(getInterestWithIcon(item))}
        keyExtractor={(item) => item.toLowerCase()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* BUTTON */}
      <View style={styles.footer}>
        <CustomButton
          loading={isLoading === "pending"}
          title={uid ? TEXTS.INTERESTS.UPDATE : TEXTS.INTERESTS.BUTTON}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    top: 30,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.black,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: "center",
    marginTop: 6,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  itemWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },

  footer: {
    margin: 16,
  },
});
