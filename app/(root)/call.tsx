import React from "react";
import { StyleSheet, View } from "react-native";
// !mark
import {
    ONE_ON_ONE_VIDEO_CALL_CONFIG,
    ZegoUIKitPrebuiltCall,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { useLocalSearchParams, useRouter } from "expo-router";
export default function VoiceCallPage() {
  const router = useRouter();
  const { avatar, fullname, number } = useLocalSearchParams(); // Get the parameters passed from ChatHeader
  return (
    <View style={styles.container}>
      // !mark(1:14)
      <ZegoUIKitPrebuiltCall
        appID={"980591144"}
        appSign={
          "18fb6cbf5b7c68bc9db9aef2d629ae28c38c743ee986444f080456cf955fdcbc"
        }
        userID={number} // userID can be something like a phone number or the user id on your own user system.
        userName={fullname}
        callID={number} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: () => {
            router.back(); // Go back to the previous screen when the call ends
            // If you're using React Navigation 6, use the navigate method instead of popTo.
            // props.navigation.popTo('HomePage')
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
});
