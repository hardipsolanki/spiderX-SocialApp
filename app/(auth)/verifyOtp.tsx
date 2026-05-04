import CustomButton from "@/components/CustomButton";
import { TEXTS } from "@/constants/texts";
import { phoneLoginThunk, verifyOtpThunk } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;

export default function VerifyOtp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<TextInput[]>([]);

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

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;
    dispatch(verifyOtpThunk({ phone: phone, otp: code }))
      .unwrap()
      .then((result) => {
        if (result?.avatar) {
          if (result.interests.length) router.replace("/(tabs)/home");
          else router.push("/(root)/interests");
        } else router.replace("/createProfile");
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

  const isComplete = otp.every((d) => d !== "");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ILLUSTRATION */}
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
        </View>

        {/* HEADER */}
        <Text style={styles.title}>{TEXTS.OTP.TITLE}</Text>
        <Text style={styles.subtitle}>
          {TEXTS.OTP.SUBTITLE} <Text style={styles.phoneText}>+91 {phone}</Text>
        </Text>

        {/* OTP BOXES */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref!) as any}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : {},
                index === otp.findIndex((d) => d === "") && styles.otpBoxActive,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
            />
          ))}
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

        {/* PROGRESS DOTS */}
        <View style={styles.progressRow}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                digit ? styles.progressDotFilled : {},
              ]}
            />
          ))}
        </View>

        {/* BUTTON */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isLoading === "pending" ? "Verifying..." : TEXTS.OTP.BUTTON}
            onPress={handleVerify}
            loading={isLoading === "pending"}
            disabled={isLoading === "pending" || !isComplete}
          />
        </View>

        {/* CHANGE NUMBER */}
        <TouchableOpacity
          style={styles.changeNumber}
          onPress={() => router.push("/phoneLogin")}
        >
          <Text style={styles.changeNumberText}>
            Wrong number? <Text style={styles.changeNumberLink}>Change</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  content: {
    flex: 1,
    padding: 24,
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
