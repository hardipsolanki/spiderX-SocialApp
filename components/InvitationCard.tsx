import { TEXTS } from "@/constants/texts";
import { getConnectedUserThunk } from "@/features/auth/authSlice";
import {
  acceptRequest,
  rejectAndRemoveRequest,
} from "@/features/connectionReqest/connectionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UserProfileContent from "./buttomSheet/Profile";

const InvitationCard = ({
  item,
  isSend,
}: {
  item: User & { requestId: string };
  isSend: boolean;
}) => {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector((state) => state.connection);

  const user = useAppSelector((state) => state.auth.user);

  // BOTTOM SHEET

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["92%"], []);

  const openProfileSheet = () => {
    requestAnimationFrame(() => {
      bottomSheetRef.current?.present();
    });
  };

  const closeSheet = () => {
    bottomSheetRef.current?.dismiss();
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

  // DECLINE

  const handleDeclineReq = () => {
    dispatch(
      rejectAndRemoveRequest({
        requestId: item.requestId,
        rejectedUserUid: item?.uid || "",
      }),
    );
  };

  // ACCEPT

  const handleAceptReq = () => {
    dispatch(
      acceptRequest({
        senderUid: item.uid,
        receiverUid: user?.uid || "",
      }),
    );

    dispatch(getConnectedUserThunk(user?.uid || ""));
  };

  return (
    <>
      {/* CARD */}

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={openProfileSheet}
      >
        {/* TOP */}

        <View style={styles.cardTop}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {item.first_name} {item.last_name}
            </Text>

            <Text style={styles.cardRole}>{item.designation}</Text>

            <View style={styles.connectionRow}>
              <Ionicons name="people-outline" size={12} color="#8B8FA3" />

              <Text style={styles.cardWants}>
                {TEXTS.INVITATIONS.WANTS_TO_CONNECT}
              </Text>
            </View>
          </View>

          {/* RIGHT */}

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={openProfileSheet}
          >
            <Ionicons name="chevron-forward" size={18} color="#6C5CE7" />
          </TouchableOpacity>
        </View>

        {/* DIVIDER */}

        <View style={styles.cardDivider} />

        {/* ACTIONS */}

        <View style={styles.cardActions}>
          <TouchableOpacity
            disabled={isLoading === "pending"}
            style={styles.declineBtn}
            activeOpacity={0.8}
            onPress={handleDeclineReq}
          >
            <Text style={styles.declineText}>{TEXTS.INVITATIONS.DECLINE}</Text>
          </TouchableOpacity>

          {!isSend && (
            <TouchableOpacity
              disabled={isLoading === "pending"}
              style={styles.acceptBtn}
              activeOpacity={0.85}
              onPress={handleAceptReq}
            >
              <Text style={styles.acceptText}>{TEXTS.INVITATIONS.ACCEPT}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* PROFILE SHEET */}

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <UserProfileContent userUid={item.uid} onClose={closeSheet} />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default InvitationCard;

const styles = StyleSheet.create({
  // CARD

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,

    borderWidth: 1,
    borderColor: "#F1F2F6",
  },

  // TOP

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
    backgroundColor: "#EEF2FF",
  },

  cardInfo: {
    flex: 1,
  },

  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  cardRole: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardWants: {
    fontSize: 12,
    color: "#8B8FA3",
    marginLeft: 4,
  },

  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // DIVIDER

  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },

  // ACTIONS

  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  declineBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9E5FF",
  },

  declineText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C5CE7",
  },

  acceptBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#6C5CE7",

    shadowColor: "#6C5CE7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },

  acceptText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // SHEET

  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  handleIndicator: {
    width: 60,
    height: 5,
    backgroundColor: "#D1D5DB",
  },
});
