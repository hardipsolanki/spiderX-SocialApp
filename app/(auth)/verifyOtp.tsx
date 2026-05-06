import CustomButton from "@/components/CustomButton";
import { TEXTS } from "@/constants/texts";
import {
  getCurrentUserThunk,
  phoneLoginThunk,
  verifyOtpThunk,
} from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;

export default function VerifyOtp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);

  //  Resend countdown timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    dispatch(verifyOtpThunk({ phone: phone, otp }))
      .unwrap()
      .then((result) => {
        dispatch(getCurrentUserThunk()).then((res: any) => {
          if (res.payload?.avatar) {
            router.replace("/(tabs)/home");
          } else {
            if (!result?.avatar) {
              router.replace("/createProfile");
            } else if (result?.interests?.length < 1) {
              router.replace("/interests");
            }
          }
        });
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error || "Something went wrong",
        });
      });
  };

  //  Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    dispatch(phoneLoginThunk(phone))
      .unwrap()
      .then((result) => {
        if (result) {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "OTP sent successfully",
          });
          router.replace("/(auth)/verifyOtp");
        }
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Something went wrong",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.mainContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            {/* ILLUSTRATION
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3064/3064155.png",
                }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View> */}

            {/* HEADER */}
            <Text style={styles.title}>{TEXTS.OTP.TITLE}</Text>
            <Text style={styles.subtitle}>
              {TEXTS.OTP.SUBTITLE}{" "}
              <Text style={styles.phoneText}> {phone}</Text>
            </Text>

            {/* OTP BOXES */}
            <View style={styles.otpContainer}>
              <OtpInput
                numberOfDigits={6}
                onTextChange={(text) => setOtp(text)}
              />
            </View>

            {/* RESEND */}
            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendActive}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>
                  Resend OTP in{" "}
                  <Text style={styles.timerCount}>
                    00:{String(timer).padStart(2, "0")}
                  </Text>
                </Text>
              )}
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={
                isLoading === "pending" ? "Verifying..." : TEXTS.OTP.BUTTON
              }
              onPress={handleVerify}
              loading={isLoading === "pending"}
              disabled={isLoading === "pending" || otp.length !== OTP_LENGTH}
            />
          </View>

          {/* CHANGE NUMBER */}
          <TouchableOpacity
            style={styles.changeNumber}
            onPress={() => router.replace("/phoneLogin")}
          >
            <Text style={styles.changeNumberText}>
              Wrong number? <Text style={styles.changeNumberLink}>Change</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  mainContainer: {
    padding: 24,
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  /* Illustration */
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
  },

  /* Header */
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
  },
  phoneText: {
    color: "#6C5CE7",
    fontWeight: "600",
  },

  /* OTP Boxes */
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 32,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 58,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#fff",
    color: "#111",
  },
  otpBoxFilled: {
    borderColor: "#6C5CE7",
    backgroundColor: "#F5F3FF",
    color: "#6C5CE7",
  },
  otpBoxActive: {
    borderColor: "#6C5CE7",
    borderWidth: 2,
  },

  /* Resend */
  resendRow: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendTimer: {
    fontSize: 13,
    color: "#999",
  },
  timerCount: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
  resendActive: {
    fontSize: 13,
    color: "#6C5CE7",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  /* Progress dots */
  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  progressDotFilled: {
    backgroundColor: "#6C5CE7",
  },

  /* Button */
  buttonContainer: {
    marginBottom: 16,
  },

  /* Change Number */
  changeNumber: {
    alignItems: "center",
  },
  changeNumberText: {
    fontSize: 13,
    color: "#666",
  },
  changeNumberLink: {
    color: "#6C5CE7",
    fontWeight: "600",
  },
});
