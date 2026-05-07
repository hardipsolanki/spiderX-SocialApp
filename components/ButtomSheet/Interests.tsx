import InterestCard from "@/components/InterestCard";
import { COLORS } from "@/constants/colors";
import { getInterestWithIcon } from "@/constants/interests";
import {
    getInterests,
    getUserInterests,
    updateUserIntrestAction,
} from "@/features/interest/interestSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditInterestSheet({
  uid,
  onClose,
}: {
  uid: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const { interests, isLoading, userInterests } = useAppSelector(
    (state) => state.interest,
  );

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getInterests())
      .unwrap()
      .then(() => {
        dispatch(getUserInterests({ uid }))
          .unwrap()
          .then((data) => {
            setSelectedInterests(data.name);
          });
      });
  }, []);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId],
    );
  };

  const handleSave = async () => {
    if (selectedInterests.length < 1) {
      Toast.show({
        type: "error",
        text1: "Selection Required",
        text2: "Please select at least 1 interest",
      });

      return;
    }

    try {
      dispatch({
        type: updateUserIntrestAction.toString(),
        payload: {
          uid,
          interest: selectedInterests,
        },
      });

      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Interests updated successfully",
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const renderInterestItem = ({ item }: { item: string }) => {
    const interest = getInterestWithIcon(item);

    return (
      <View style={styles.itemWrapper}>
        <InterestCard
          id={interest.id}
          name={interest.name}
          icon={interest.iconName}
          selected={selectedInterests.includes(interest.id)}
          onPress={() => toggleInterest(interest.id)}
        />
      </View>
    );
  };

  if (
    isLoading === "pending" ||
    !userInterests.name.length ||
    !selectedInterests.length
  ) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        {/* CLOSE */}

        <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color="#111" />
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>Update Interests</Text>

        {/* SAVE */}

        <TouchableOpacity style={styles.iconBtn} onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* SUBTITLE */}

      {/* LIST */}

      <BottomSheetFlatList
        data={interests.name}
        keyExtractor={(item) => item.toLowerCase()}
        renderItem={renderInterestItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 18,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  itemWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
});
