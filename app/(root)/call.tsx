import {
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ZegoUIKitPrebuiltCall,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function CallScreen() {
  const router = useRouter();

  const { chatId, name, avatar, number } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={980591144}
        appSign="18fb6cbf5b7c68bc9db9aef2d629ae28c38c743ee986444f080456cf955fdcbc"
        userID={String(number)} // same ID = same room
        userName={String(name)}
        callID={String(chatId)} // same ID = same room
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,

          onCallEnd: () => {
            router.back();
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
